# Rocket Viewer

The Rocket Viewer is a simple and generic viewer that allows you to visualize diferent kind of resources such as medical images, biological images and documents.

Rocket viewer can visualize data from the web just typing a URL or can load information from the local file system just drag and dropping a file from the localhost. 

### Compatible formats

* Medical images:
DICOM: One frame (2D visualization), multi frame (2D visualization + t)
* Biological images: Tiff images
* Signals: PDF

### Working on ...

* Surfaces: VTK (3D Visualization), PLY (3D Visualization)
* Surfaces + Medical images: NRRD (3D Visualization)

### Quick start

```
git clone bla bla
```

Installing dependencies

```
npm install
```

Running the app

```
npm run start-dev
```

### Libraries that we use

Image visualization:
* [Cornerstone](https://github.com/chafey/cornerstone) a javaScript library to display interactive medical images including but not limited to DICOM .
* [Cornerstone tools](https://github.com/chafey/cornerstoneTools) a framework for tools built on top of cornerstone.
* [Cornerstone wado image loader](https://github.com/chafey/cornerstoneWADOImageLoader) a DICOM WADO Image Loader for the cornerstone library.
* [Cornerstone web image loader](https://github.com/chafey/cornerstoneWebImageLoader) an image Loader for Web Images (PNG, JPEG). 

User interface:
* [React](https://github.com/facebook/react) a javascript framework for building interfaces .
* [create-react-app](https://github.com/facebookincubator/create-react-app) Bootstraping the whole project .
* [foundation for apps](https://foundation.zurb.com/apps.html) The first front-end framework created for developing fully responsive web apps. 
* [Sass](http://sass-lang.com/) Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

