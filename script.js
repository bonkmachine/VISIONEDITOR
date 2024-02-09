let fixedCanvasWidth, maxCanvasHeight;

if (window.innerWidth <= 768) {
  fixedCanvasWidth = 300;
  maxCanvasHeight = 300;
} else {
  fixedCanvasWidth = 600;
  maxCanvasHeight = 600;
}

const stage = new Konva.Stage({
  container: "canvas-container",
  width: fixedCanvasWidth,
  height: maxCanvasHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

let mustache;
let canvasBorder;
let tr;

const addMustacheToCanvas = () => {
  const mustacheImageSrc =
    "https://i.ibb.co/pd1qxyg/1.png";

  canvasBorder = new Konva.Rect({
    width: stage.width(),
    height: stage.height(),
    stroke: "white",
    strokeWidth: 3,
    cornerRadius: 20,
  });

  layer.add(canvasBorder);

  Konva.Image.fromURL(mustacheImageSrc, (img) => {
    mustache = img;
    const aspectRatio = img.width() / img.height();

    let newMustacheWidth, newMustacheHeight;

    if (window.innerWidth <= 768) {
      newMustacheWidth = 100;
      newMustacheHeight = 100 / aspectRatio;
    } else {
      newMustacheWidth = 250;
      newMustacheHeight = 250 / aspectRatio;
    }

    if (newMustacheHeight > maxCanvasHeight) {
      newMustacheHeight = maxCanvasHeight;
      newMustacheWidth = maxCanvasHeight * aspectRatio;
    }

    mustache.setAttrs({
      width: newMustacheWidth,
      height: newMustacheHeight,
      x: (stage.width() - newMustacheWidth) / 2,
      y: (stage.height() - newMustacheHeight) / 2,
      name: "mustache",
      draggable: true,
    });

    tr = new Konva.Transformer({
      nodes: [mustache],
      enabledAnchors: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
      keepRatio: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (
          Math.abs(newBox.width) < 10 ||
          Math.abs(newBox.height) < 10
        ) {
          return oldBox;
        }
        return newBox;
      },

      padding: 10,
      rotateEnabled: true,
    });

    mustache.on("click tap", () => {
      if (window.innerWidth <= 768) {
        tr.visible(!tr.visible());
        layer.batchDraw();
      } else {
        tr.visible(!tr.visible());
        layer.batchDraw();
      }
    });

    layer.add(canvasBorder);
    layer.add(mustache);
    layer.add(tr);
    tr.visible(false);

    layer.batchDraw();
  });
};

const changeCanvasBackground = (imageSrc) => {
  const background = new Image();
  background.onload = function () {
    const aspectRatio = background.width / background.height;

    let newCanvasWidth = fixedCanvasWidth;
    let newCanvasHeight = fixedCanvasWidth / aspectRatio;

    if (newCanvasHeight > maxCanvasHeight) {
      newCanvasHeight = maxCanvasHeight;
      newCanvasWidth = maxCanvasHeight * aspectRatio;
    }

    stage.width(newCanvasWidth);
    stage.height(newCanvasHeight);

    canvasBorder.width(newCanvasWidth);
    canvasBorder.height(newCanvasHeight);

    const bg = new Konva.Image({
      image: background,
      width: newCanvasWidth,
      height: newCanvasHeight,
    });

    layer.destroyChildren();
    layer.add(bg);
    addMustacheToCanvas();
    layer.batchDraw();
    $("#uploadButton").hide();
    $("#closeButton").show();
    $("#saveButton").show();
  };
  background.src = imageSrc;
};

const saveCanvasAsImage = () => {
  tr.visible(false);
  layer.batchDraw();

  const dataURL = stage.toDataURL({
    mimeType: "image/png",
    quality: 1,
    pixelRatio: 3,
  });
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "I_HAVE_VISION.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  tr.visible(true);
  layer.batchDraw();
};

const resetCanvas = () => {
  $("#uploadButton").show();
  addMustacheToCanvas();
  $("#closeButton").hide();
  $("#saveButton").hide();
  layer.destroyChildren();
  stage.width(fixedCanvasWidth);
  stage.height(maxCanvasHeight);
  canvasBorder = new Konva.Rect({
    width: stage.width(),
    height: stage.height(),
    stroke: "white",
    strokeWidth: 3,
    cornerRadius: 20,
  });
  layer.add(canvasBorder);
  layer.batchDraw();
};

$(document).ready(function () {
  $("#closeButton").hide();
  $("#saveButton").hide();
  addMustacheToCanvas();
});

$("#uploadButton").click(function () {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageSrc = event.target.result;
        changeCanvasBackground(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  });

  input.click();
});

$("#saveButton").click(function () {
  saveCanvasAsImage();
});

$("#closeButton").click(function () {
  resetCanvas();
});
