$(document).ready(function (e) {
  $("#file").on('change', (e) => {
    document.getElementById('image').src = "";
    file = e.target.files[0]
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      document.getElementById('image').src = reader.result
    }, true)

    if (file) { reader.readAsDataURL(file); }
  })


  let x, y, width, height, rotate, scaleX, scaleY, cropper, image;
  $("#btnCrop").on('click', () => {
    $("#file").prop('disabled', 'true')
    $('#btnCrop').prop('disabled', 'true')
    $('#btnCropOk').removeAttr('disabled')
    $('#btnCropReset').removeAttr('disabled')
    image = document.getElementById('image');
    cropper = new Cropper(image,
      {
        viewMode: 0,
        crop(event) {
          x = event.detail.x
          y = event.detail.y
          width = event.detail.width
          height = event.detail.height
          rotate = event.detail.rotate
          scaleX = event.detail.scaleX
          scaleY = event.detail.scaleY
        },
      });

  })

  $('#btnCropOk').on('click', () => {
    let croppedimage = cropper.getCroppedCanvas().toBlob(blob => {
      const formData = new FormData();

      formData.append('file', blob, `${Math.round(Math.random() * 100000)}.png`);
      $.ajax('/upload', {
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success(response) {
          console.log(response)
          data = JSON.parse(response)
          $(".card-text").html(data.text)
          $(".img").attr('src', data.img)
        },
        error(e) {
          console.log(e);
        },
      });

    }, 'image/jpeg', 0.95)
  })
  $('#btnCropReset').click(() => {
    $("#file").removeAttr("disabled");
    $('#btnCrop').removeAttr("disabled");
    $('#btnCropOk').prop("disabled", 'true');
    cropper.destroy()
  })
});

