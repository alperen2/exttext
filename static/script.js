$(document).ready(function (e) {
  $("#formUpload").on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/upload',
      data: new FormData(this),
      dataType: 'json',
      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {
        $('.submitBtn').attr("disabled", "disabled");
        $('#fupForm').css("opacity", ".5");
      },
      success: function (response) {
        console.log(response);

        $(".card-text").html(response.text)
        $(".img").attr('src', response.img)
        $('#formUpload').css("opacity", "");
        $("#btnUpload").removeAttr("disabled");
      }
    });
  });

  $("#file").on('change', (e) => {
    document.getElementById('image').src = "";
    let preview = document.getElementById('preview');
    file = document.getElementById('file').files[0]
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      document.getElementById('image').src = reader.result
    }, false)

    if (file) { reader.readAsDataURL(file); }
  })


  let x;
  let y;
  let width;
  let height;
  let rotate;
  let scaleX;
  let scaleY;
  let cropper;
  let image;

  $("#btnCrop").on('click', () => {
    image = document.getElementById('image');
    cropper = new Cropper(image,
      {
        viewMode: 1,
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

  // $('#btnCropOk').on('click', () => {
  //   var croppedimage = cropper.getCroppedCanvas().toDataURL("image/png");
  //   $('#has').html(cropper.getCroppedCanvas());
  //   $('#preview').src = croppedimage
  // })

  $('#btnCropOk').on('click', () => {
    let croppedimage = cropper.getCroppedCanvas(
      {
        width: 160,
        height: 90,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
      }).toBlob(blob => {
        const formData = new FormData();
        console.log(blob);
        
        formData.append('file', blob, `${Math.round(Math.random()*100000)}.png`);
        $.ajax('/upload', {
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success() {
            console.log('Upload success');
          },
          error() {
            console.log('Upload error');
          },
        });

      }, 'image/jpeg', 0.95)




  })
});

