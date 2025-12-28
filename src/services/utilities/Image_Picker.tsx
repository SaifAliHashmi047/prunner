import ImagePicker from 'react-native-image-crop-picker';

export function Image_Picker(type : any) {
  return new Promise(async function (resolve, reject) {
    // console.warn("TYPEheloooo", type);
    if (type.toLowerCase() === "gallery") {
      ImagePicker.openPicker({
        width: 2200,
        height: 2200,
        cropping: true,
        mediaType: "photo",
        compressImageQuality: 0.8,
        freeStyleCropEnabled: false,
        cropperCircleOverlay: false
      })
        .then(image => {
          resolve(image);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type.toLowerCase() === "cropped") {
      ImagePicker.openPicker({
        width: 2200,
        height: 1400,
        cropping: true,
        mediaType: "photo",
        compressImageQuality: 0.8,
        freeStyleCropEnabled: false,
        cropperCircleOverlay: false
      })
        .then(image => {
          resolve(image);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type.toLowerCase() === "coverphoto") {
      //start of gallery
      ImagePicker.openPicker({
        width: 2400,
        height: 1200,
        cropping: true,
        mediaType: "photo",
        compressImageQuality: 0.8,
        compressImageMaxWidth: 2400,
        compressImageMaxHeight: 1200,
        freeStyleCropEnabled: false,
        cropperCircleOverlay: false
      })
        .then(image => {
          resolve(image);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type.toLowerCase() === "gallerynocrop") {
      ImagePicker.openPicker({
        width: 2200,
        height: 2200,
        mediaType: "photo",
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1200,
        compressImageMaxHeight: 1200,
        freeStyleCropEnabled: false,
        cropperCircleOverlay: false
      })
        .then(image => {
          resolve(image);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type === "videoGallery") {
      ImagePicker.openPicker({

        mediaType: "video",
        writeTempFile: true,
        duration: true,
        compressVideoPreset: '1280x720',
      })
        .then(video => {
          resolve(video);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type.toLowerCase() === "camera") {
      ImagePicker.openCamera({
        width: 2200,
        height: 2200,
        cropping: true,
        mediaType: "photo",
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1200,
        compressImageMaxHeight: 2200,
        freeStyleCropEnabled: true,
        cropperCircleOverlay: false
      })
        .then(image => {
          resolve(image);
        })
        .catch(err => {
          console.log('--------__<<<<<<', err)
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
        });
    }
    else if (type === "videoCamera") {
      ImagePicker.openCamera({

        mediaType: "video",
        duration: true,
        
      })
        .then(video => {
          resolve(video);
        })
        .catch(err => {
          let a = err.toString().toLowerCase();
          if (a.includes("error: user cancelled image selection"))
            reject("cancel");
          // console.warn("errrrrrrr ", err);
        });
    }
    else {
      resolve(false);
    }
  });
};