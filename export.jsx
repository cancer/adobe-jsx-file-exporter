//
//----- ファイル作成周りのサポート
//
var Exporter = (function(docObj, settings){

  function exporter(){
    this.saveOpt = {
      //png8 : {
      //  format       : SaveDocumentType.PNG,
      //  interlaced   : false,
      //  PNG8         : settings.custom.check_png8,
      //  transparency : true
      //},
      //png24 : {
      //  interlaced   : false,
      //  transparency : true
      //},
      png : {
        format       : SaveDocumentType.PNG,
        interlaced   : false,
        PNG8         : settings.custom.check_png8,
        transparency : true,
        quality      : 100
      },
      text : {
        writeMode : settings.files.writeMode,
        lineFeed  : settings.files.lineFeed
      }
    }
  }

  //
  //----- ファイルのパスをよしなに作ってくれる
  //
  exporter.prototype.createPath = function createPath(path, name){
    name = name || "";
    var separator = path.lastIndexOf("/") === 0 ? "" : "/";

    return path + separator + name;
  }

  //
  //----- とにかくファイル作成
  //
  exporter.prototype.createFile = function createFile(path, name){
    var fileObj = new File(this.createPath(path, name));
    fileObj.remove();

    return fileObj || null;
  }

  //
  //----- フォルダ作成
  //
  exporter.prototype.createFolder = function createFolder( path, name ){
    var folderObj = new Folder(this.createPath(path, name));
    folderObj.create();

    return folderObj;
  }

  //
  //----- bounds.yaml作成
  //
  exporter.prototype.createBoundsFile = function createConfFile(exports){
    var indent = settings.files.indentCharacter;
    var fileName = settings.files.confFileName;
    var confObj = this.createFile(util.getPath(docObj), fileName);

    // confが開けなかったら終了
    if(confObj === null){
      alert(settings.files.confFileName + "が開けませんでした");
      return;
    }

    confObj.open(this.saveOpt.text.writeMode);
    confObj.lineFeed = this.saveOpt.text.lineFeed;

    confObj.writeln("img_fg_layout:");
    confObj.write(exports.orderData);
    confObj.writeln(indent + "trim: ");
    confObj.write(exports.trimData);
    confObj.writeln(indent + "offset: ");
    confObj.write(exports.boundsData);

    confObj.close();
  }

  //
  //----- PNG保存（レイヤーからPNGへ）
  //
  exporter.prototype.createPng = function createPng(doc, path, obj, name){
    var pngObj = this.createFile(path, name + ".png");

    var pngOpt = null;
    pngOpt = _.extend(new ExportOptionsSaveForWeb(), this.saveOpt.png);
    doc.exportDocument(pngObj, ExportType.SAVEFORWEB, pngOpt);
    //if(settings.custom.check_png8){
    //  pngOpt = _.extend(new ExportOptionsSaveForWeb, this.saveOpt.png8);
    //  doc.exportDocument(pngObj,ExportType.SAVEFORWEB,pngOpt);
    //}else{
    //  pngOpt = _.extend(new PNGSaveOptions, this.saveOpt.png24);
    //  doc.saveAs( pngObj, pngOpt, true, Extension.LOWERCASE );
    //}
  }


  return exporter;
})(app.activeDocument, settings);

