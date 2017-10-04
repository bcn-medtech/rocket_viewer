# Rocket viewer

The rocket viewer is a generic viewer that allows you to visualize different kind of data, such as Medical images (DICOM) microcoscopic images (TIFF) or surfaces (VTK, NRRD), using the latest web technologies.

**The rocket viewer** itself, is just a manager, an abstract entity that depending of the input that can be given from an *URL* or just drag and dropping to the web browser choose the necessary technology to visualize the data. 

## Test data

* Dicom images one frame: 
* -> URL: https://www.dl.dropboxusercontent.com/s/dnpps24dsbzrbgy/IMG00029133.dcm?dl=0

* Dicom image multiframe:
* -> URL:
https://www.dl.dropboxusercontent.com/s/22ayfa2zfnm3qjz/Short_axis_init.dcm?dl=0

* Tiff image:
* -> URL: https://www.dl.dropboxusercontent.com/s/3p20fnuzabc6xvs/Img_0001_Nuc.tif?dl=0
* Vtk volume:
* NRRD volume, image + surface:

## Test data in viewer

Dicom image one frame

```
http://localhost:3000/viewer?type=dicom&url=https%3A%2F%2Fwww%2Edl%2Edropboxusercontent%2Ecom%2Fs%2Fdnpps24dsbzrbgy%2FIMG00029133%2Edcm%3Fdl%3D0
```

Dicom image multi frame

```
http://localhost:3000/viewer?type=dicom&url=https%3A%2F%2Fwww%2Edl%2Edropboxusercontent%2Ecom%2Fs%2F22ayfa2zfnm3qjz%2FShort_axis_init%2Edcm%3Fdl%3D0

```

Tif image 

```
http://localhost:3000/viewer?type=tif&url=https%3A%2F%2Fwww%2Edl%2Edropboxusercontent%2Ecom%2Fs%2F3p20fnuzabc6xvs%2FImg_0001_Nuc%2Etif%3Fdl%3D0
```