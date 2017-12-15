export function divideImagesInSections(all_files, num_img_per_section) {
    // input --> 
    // all_files: {0: File, 1: File, ..., length: N}
    // num_img_per_section: #images in each FULL section
    /* output -->
        img_sections_info: {
            "number_sections": x,
            "sections":[
                1: { "index:"1, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int }, <-- info of full section with n images
                2: { "index:"1, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int }, <-- info of full section with n images
                ...,
                x: { "index:"x, "num_img": num_img_per_section, "first_file_id": int, "last_file_id": int }, <-- info of last full section with n images
                y: { "index:"y, "num_img": int, "first_file_id": int, "last_file_id": int }, <-- info of (the only) incomplete section with ? images (it may not exist)
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
                    1: { "index:"1, "num_img": 20, "first_file_id": 0, "last_file_id": 19 }, <-- full section
                    2: { "index:"1, "num_img": 20, "first_file_id": 20, "last_file_id": 39 }, <-- full section
                    3: { "index:"x, "num_img": 20, "first_file_id": 40, "last_file_id": 59 }, <-- full section
                    4: { "index:"y, "num_img": 1, "first_file_id": 60, "last_file_id": 61 }, <-- (the only) incomplete section (it exists in this case)
                ]
            }
    */

    var img_sections_info;
    var total_num_sections;

    if ((all_files.length < num_img_per_section) || (all_files.length === num_img_per_section)) {
        total_num_sections = 1;

        img_sections_info = {
            "number_sections": total_num_sections,
            "sections": { "1:": { "index": 1, "num_img": num_img_per_section, "first_file_id": 0, "last_file_id": all_files.length - 1 } }
        };

    } else if (all_files.length > num_img_per_section) {

        var num_full_sections;

        if (Number.isInteger(all_files.length / num_img_per_section)) {

            num_full_sections = all_files.length / num_img_per_section;
            total_num_sections = num_full_sections;

        } else {

            num_full_sections = Math.floor(all_files.length / num_img_per_section);
            total_num_sections = num_full_sections + 1;

        }

        img_sections_info = { "number_sections": total_num_sections, "sections": {} };
        var sectionsObject = img_sections_info.sections; // we have to fill with info

        var current_file_id = 0;

        // 1st. Creation of the FULL SECTIONS with their files
        for (var i = 0; i < num_full_sections; i++) {
            
            // we want the sections indexes to be [1, 2, ..., num_full_sections], rather than [0, 1, ..., num_full_sections-1]
            var current_section_id = i + 1;
            sectionsObject[current_section_id] = { "index": current_section_id, "num_img": num_img_per_section, "first_file_id": false, "last_file_id": false };

            sectionsObject[current_section_id].first_file_id = current_file_id;
            sectionsObject[current_section_id].last_file_id = current_file_id + num_img_per_section - 1; // "- 1" because "current_file_id" starts at 0 in the for loop

            current_file_id = current_file_id + num_img_per_section;

        }

        // 2nd. Creation of the (only) INCOMPLETE SECTION with the rest of the files
        var num_files_incomplete_section = all_files.length - current_file_id;
        sectionsObject[total_num_sections] = { "index": total_num_sections, "num_img": num_files_incomplete_section, "first_file_id": current_file_id, "last_file_id": all_files.length - 1 };

        // LAST STEP
        img_sections_info.sections = sectionsObject;
    }

    return img_sections_info;

}