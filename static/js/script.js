let x, y, width, height, rotate, scaleX, scaleY, cropper, image;
$(document).ready(function (e) {

  $("#file").on('change', (e) => {
    $("#tools").show();
    $('#image').src = "";
    file = e.target.files[0]
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      document.getElementById('image').src = reader.result

      $("#file").prop('disabled', 'true')
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
    }, true)

    if (file) { reader.readAsDataURL(file); }


  })

  $('#btnRotate').click((e) => {
    $(".rotate_wrapper").toggle()
  })

  $("#rotate_range").on('change', (e) => {
    $('.valueSpan2').html(90 - e.target.value)
    cropper.rotateTo(90 - e.target.value)
    cropper.scale()

  })

  $('#btnCropOk').on('click', () => {
    $(".card-text").hide()
    $(".spinner-border").show()
    let croppedimage = cropper.getCroppedCanvas().toBlob(blob => {
      const formData = new FormData();

      formData.append('file', blob, `${Math.round(Math.random() * 100000)}.png`);
      $.ajax('/upload', {
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success(response) {
          data = JSON.parse(response)
          if (data.text == "") {
            $(".card-text").show().html("Yazı yok ya da algılanamadı.")
          }
          else {
            $(".card-text").show().html(data.text)
          }
          $(".img").attr('src', data.img)
          $(".spinner-border").hide()
        },
        error(e) {
          $(".spinner-border").hide()
          $(".card-text").show().html("Bir hata oluştu, daha sonra tekrar deneyiniz.")
        },
      });

    }, 'image/jpeg', 0.95)

  })

  $('#btnCropReset').click(() => {
    $("#file").removeAttr("disabled");
    $("#image").removeAttr('src');
    $("#tools").hide();
    cropper.destroy();
  })
});

