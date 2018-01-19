/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

export function divideImagesInSections(all_files, num_img_per_section) {
    // input --> 
    // all_files: {0: File, 1: File, ..., length: N}
    // num_img_per_section: #images in each FULL section
    /* output -->
        img_sections_info: {
            "number_sections": x,
            "sections":[
                1: { "index:"1, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int, "navigation_info": first_file_id+1+" - "+last_file_id+1+" of "+all_files.length }, <-- info of full section with n images
                2: { "index:"1, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int, "navigation_info": first_file_id+1+" - "+last_file_id+1+" of "+all_files.length }, <-- info of full section with n images
                ...,
                x: { "index:"x, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int, "navigation_info": first_file_id+1+" - "+last_file_id+1+" of "+all_files.length }, <-- info of last full section with n images
                y: { "index:"y, "num_img": int, "first_file_id": int, "last_file_id": int, "navigation_info": first_file_id+1+" - "+last_file_id+1+" of "+all_files.length }, <-- info of (the only) incomplete section with ? images (it may not exist)
            ]
        }
    */
    /* Example:
        INPUTS:
            all_files: {0: File, 1: File, ..., length: 62} <-- 62 Files of images in total
            number_img_per_section = 20
            --> Math.floor(62/20) = 3 full sections of 20 images and 1 incomplete of 1 image <-- 4 sections in total
        OUTPUT:
            img_sections_info: {
                "number_sections": 4,
                "sections":[
                    1: { "index:"1, "num_img": 20, "first_file_id": 0, "last_file_id": 19, "navigation_info": "1 - 20 of 62" }, <-- full section
                    2: { "index:"1, "num_img": 20, "first_file_id": 20, "last_file_id": 39, "navigation_info": "21 - 40 of 62" }, <-- full section
                    3: { "index:"x, "num_img": 20, "first_file_id": 40, "last_file_id": 59, "navigation_info": "41 - 61 of 62" }, <-- full section
                    4: { "index:"y, "num_img": 1, "first_file_id": 60, "last_file_id": 61, "navigation_info": "62 - 62 of 62" }, <-- (the only) incomplete section (it exists in this case)
                ]
            }
    */

    var img_sections_info;
    var total_num_sections;

    if ((all_files.length < num_img_per_section) || (all_files.length === num_img_per_section)) {
        total_num_sections = 1;

        img_sections_info = {
            "number_sections": total_num_sections,
            "sections": {
                "1": {
                    "index": 1,
                    "num_img": num_img_per_section,
                    "first_file_id": 0, "last_file_id": all_files.length - 1,
                    "navigation_info": "1 - " + all_files.length + " of " + all_files.length
                }
            }
        };

    } else if (all_files.length > num_img_per_section) {

        var num_full_sections;
        var thereIsIncompleteSection;

        if (Number.isInteger(all_files.length / num_img_per_section)) {
            num_full_sections = all_files.length / num_img_per_section;
            total_num_sections = num_full_sections;
            thereIsIncompleteSection = false;

        } else {
            num_full_sections = Math.floor(all_files.length / num_img_per_section);
            total_num_sections = num_full_sections + 1;
            thereIsIncompleteSection = true;

        }

        img_sections_info = { "number_sections": total_num_sections, "sections": {} };
        var sectionsObject = img_sections_info.sections; // we have to fill with info

        var current_file_id = 0;
        var first_file_id, last_file_id;
        var first_file_id_navigation, last_file_id_navigation;

        // 1st. Creation of the FULL SECTIONS with their files
        for (var i = 0; i < num_full_sections; i++) {
           
            // we want the sections indexes to be [1, 2, ..., num_full_sections], rather than [0, 1, ..., num_full_sections-1]
            var current_section_id = i + 1;
            sectionsObject[current_section_id] = {
                "index": current_section_id,
                "num_img": num_img_per_section,
                "first_file_id": false,
                "last_file_id": false,
                "navigation_info": false
            };

            first_file_id = current_file_id;
            last_file_id = current_file_id + num_img_per_section - 1; // "- 1" because "current_file_id" starts at 0 in the for loop
            first_file_id_navigation = first_file_id + 1;
            last_file_id_navigation = last_file_id + 1;

            sectionsObject[current_section_id].first_file_id = first_file_id;
            sectionsObject[current_section_id].last_file_id = last_file_id;
            sectionsObject[current_section_id].navigation_info = first_file_id_navigation + " - " + last_file_id_navigation + " of " + all_files.length;

            current_file_id = current_file_id + num_img_per_section;

        }

        // 2nd. Creation of the (only) INCOMPLETE SECTION with the rest of the files (in case there is)
        if (thereIsIncompleteSection) {
            var num_files_incomplete_section = all_files.length - current_file_id;
            first_file_id = current_file_id;
            last_file_id = all_files.length;
            first_file_id_navigation = first_file_id + 1;
            last_file_id_navigation = last_file_id;

            sectionsObject[total_num_sections] = {
                "index": total_num_sections,
                "num_img": num_files_incomplete_section,
                "first_file_id": first_file_id,
                "last_file_id": last_file_id - 1,
                "navigation_info": first_file_id_navigation + " - " + last_file_id_navigation + " of " + all_files.length
            };
        }


        // LAST STEP
        img_sections_info.sections = sectionsObject;
    }

    return img_sections_info;

}