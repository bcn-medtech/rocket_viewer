![alt text](https://github.com/bcnmedtech/rocket_viewer/blob/master/assets/logo.png "Logo Title Text 1")

# Rocket Viewer
[![DOI](https://zenodo.org/badge/118635567.svg)](https://zenodo.org/badge/latestdoi/118635567)

This simple and generic viewer allows you to visualize different kinds of data such as medical and biological images, 3D surfaces, electric signals (ECGs) and documents.

**Rocket viewer** allows visualizing data from the web or loading information from the local file system by simply dragging and dropping a file into the browser. 


**Rocket viewer** is **© Universitat Pompeu Fabra 2017**. 
Original Developers: *Carlos Yagüe Méndez, María del Pilar García, Daniele Pezzatini.* 
Contributors: *Sergio Sánchez Martínez, Oscar Cámara, Bart Bijnens.*

*This work is partly funded by the Spanish Ministry of Economy and Competitiveness under the María de Maeztu Units of Excellence Program (MDM-2015-0502).*

### Compatible formats

* Medical images:DICOM (one frame = 2D visualization, multi-frame = 2D visualization + t)
* Biological images: TIFF
* Signals: PDF
* Surfaces: VTK (3D Visualization), PLY (3D Visualization)
* Surfaces + Medical images: NRRD (3D Visualization)
* Electric signals: CSV files

### Try the viewer [here](http://rkt-viewer.surge.sh/)

[![IMAGE ALT TEXT](http://img.youtube.com/vi/EGo5Roh2fcA/0.jpg)](http://www.youtube.com/watch?v=EGo5Roh2fcA "Video Title")


### Quick start

```
git clone https://github.com/bcnmedtech/rocket_viewer.git
```

Installing dependencies

```
npm install
```

Running the app

```
npm run start-dev
```

Create website for production

```
npm run production
```

### Sample data

![alt text](https://github.com/bcnmedtech/rocket_viewer/blob/master/assets/folder_black.png "Logo Title Text 1")

* [Microscope image (Tif)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/microscopy_image.tif)
* [Electronic Signals (txt)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/signals.txt)
* [Head volume 3D (nrrd)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/volume_3D_nrrd_head.nrrd)
* [Heart volume 3D (ply)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/volume_3D_ply.ply)
* [Heart volume 3D with labels wit field data format (vtk)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/volume_3D_vtk_field_data.vtk)
* [Heart volume 3D with labels wit field scalars format (vtk)](https://github.com/bcnmedtech/rocket_viewer/blob/master/sample_data/volume_3D_vtk_scalars.vtk)

### Videos

* [Demo](https://www.youtube.com/watch?v=EGo5Roh2fcA&feature=youtu.be)

### Tutorials

:(   Available soon ......

## License
**Rocket viewer** *is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.*

*Rocket viewer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.You should have received a copy of the GNU General Public License along with Rocket viewer.  If not, see <http://www.gnu.org/licenses/>.*