'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const FontServiceBoxUpdate = ({ id }) => {


    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);

    const [created_by, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);




    // const [linkData, setLinkData] = useState({
    //     link1: { type: '1', value: 'https//', disabled: false },
    //     link2: { type: '1', value: 'https//', disabled: false },
    //     link3: { type: '1', value: 'https//', disabled: false },
    //     link4: { type: '1', value: 'https//', disabled: false },
    //     link5: { type: '1', value: 'https//', disabled: false },
    // });
    const [linkData, setLinkData] = useState({
        link1: { type: '1', value: 'https//', disabled: false, name: '' },
        link2: { type: '1', value: 'https//', disabled: false, name: '' },
        link3: { type: '1', value: 'https//', disabled: false, name: '' },
        link4: { type: '1', value: 'https//', disabled: false, name: '' },
        link5: { type: '1', value: 'https//', disabled: false, name: '' },
    });


    const handleSelectChange = (id, value) => {
        const updatedLinkData = { ...linkData };
        updatedLinkData[id].type = value;

        switch (value) {
            case '1': // External
                updatedLinkData[id].value = 'https//';
                updatedLinkData[id].disabled = false;
                break;
            case '2': // Front page
                updatedLinkData[id].value = 'font';
                updatedLinkData[id].disabled = true;
                break;
            case '3': // No Link
                updatedLinkData[id].value = 'no link';
                updatedLinkData[id].disabled = true;
                break;
            case '4': // Content Reference
                updatedLinkData[id].value = '';
                updatedLinkData[id].disabled = true;
                break;
            default:
                break;
        }


        setLinkData(updatedLinkData)

    };



    console.log(linkData)

    const [formData, setFormData] = useState({
        title: "",
        sort: "",
        status: "",
        photo: "",
        created_by: created_by,
    });


    const { data: front_service_box_single = [], } = useQuery({
        queryKey: ['front_service_box_single'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/front_service_box/front_service_box_single/${id}`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });





    // useEffect(() => {
    //     setFormData({

    //         title: front_service_box_single[0]?.title || '',
    //         sort: front_service_box_single[0]?.sort || '',
    //         status: front_service_box_single[0]?.status || '',
    //         photo: front_service_box_single[0]?.photo || '',

    //         modified_by: created_by,

    //     });

    // }, [front_service_box_single, created_by]);

    // useEffect(() => {
    //     // Update formData with fetched data
    //     setFormData({
    //         title: front_service_box_single[0]?.title || '',
    //         sort: front_service_box_single[0]?.sort || '',
    //         status: front_service_box_single[0]?.status || '',
    //         photo: front_service_box_single[0]?.photo || '',
    //         modified_by: created_by,
    //     });

    //     // Dynamically set linkData based on fetched data
    //     const links = ['link1', 'link2', 'link3', 'link4', 'link5'];
    //     const updatedLinkData = {};

    //     links.forEach((link) => {
    //         if (front_service_box_single[0]?.[`${link}_url`]) {
    //             updatedLinkData[link] = {
    //                 type: front_service_box_single[0][`${link}_url`] === '#' || front_service_box_single[0][`${link}_url`] === '' ? '3' : '1',
    //                 value: front_service_box_single[0][`${link}_url`] || 'no link',
    //                 disabled: front_service_box_single[0][`${link}_url`] === '#' || front_service_box_single[0][`${link}_url`] === '',
    //             };
    //         }
    //     });

    //     setLinkData((prev) => ({
    //         ...prev,
    //         ...updatedLinkData,
    //     }));
    // }, [front_service_box_single, created_by]);

    useEffect(() => {
        // Update formData with fetched data
        setFormData({
            title: front_service_box_single[0]?.title || '',
            sort: front_service_box_single[0]?.sort || '',
            status: front_service_box_single[0]?.status || '',
            photo: front_service_box_single[0]?.photo || '',
            modified_by: created_by,
        });

        // Dynamically set linkData based on fetched data
        const links = ['link1', 'link2', 'link3', 'link4', 'link5'];
        const updatedLinkData = {};

        links.forEach((link) => {
            const url = front_service_box_single[0]?.[`${link}_url`];
            const name = front_service_box_single[0]?.[link];

            updatedLinkData[link] = {
                type:
                    url === 'no link' ? '3' : // No Link
                        url === 'font' ? '2' :   // Front Page
                            url?.startsWith('https//') ? '1' : // External Link
                                '4', // Content Reference
                value: url || 'no link', // Default value
                disabled: url === 'no link' || url === 'font' || !url, // Disable for No Link, Front Page, or empty
                name: name || '', // Set name from fetched data
            };
        });

        setLinkData((prev) => ({
            ...prev,
            ...updatedLinkData,
        }));
    }, [front_service_box_single, created_by]);


    const [title, seTitle] = useState('')
    const [sort, setSort] = useState('')
    const [status, setStatus] = useState('')
    const [name, setName] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Adding linkData to the formData
        }));
        if (name === 'title') {
            seTitle('')
        }
        if (name === 'sort') {
            setSort('')
        }
        if (name === 'status') {
            setStatus('')
        }
    };


    console.log(formData)



    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const [fileSizeError, setFileSizeError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    const brandFileChange = (e) => {
        const file = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const path = `font_service_box/${time}/${newName}`;

        const newSelectedFile = { ...file, path };

        if (file.size <= 2097152) {
            setFileSizeError("");
            setFileNames(newName);
            setSelectedFile(newSelectedFile);
            setUploadProgress(0); // Reset progress when a new file is selected
            upload(file, path);
        } else {
            setFileSizeError("Max file size 2 MB");
        }

        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
    };

    const upload = (file, path) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/font_service_box/font_service_box_image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        })
            .then(res => {
                console.log(res);
                setUploadProgress(100); // Set progress to 100% on success
                setUploadedFileUrl(path); // Set the uploaded file URL to show the image
            })
            .catch(err => {
                console.log(err);
                setUploadProgress(0); // Reset the progress bar on error
            });
    };

    const [modalData, setModalData] = useState({ id: '', value: '' });
    // const handleInputChange = (id, value) => {
    //     setLinkData((prevState) => ({
    //         ...prevState,
    //         [id]: {
    //             ...prevState[id],
    //             value: value,
    //         },
    //     }));
    // };
    const handleInputChange = (id, key, value) => {
        setLinkData((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [key]: value,
            },
        }));
        // if (key === 'name') {
        //     setName('')
        // }
        for (const [key, link] of Object.entries(linkData)) {
            if (link.name) {
                setName('');
                return; // Prevent further execution
            }
        }
    };


    const openModal = (id) => {
        if (linkData[id].type === '4') {
            // Show the modal for content reference and set the modal data
            setModalData({ id, value: linkData[id].value });
        }


    };



    const saveModalChanges = (page) => {
        setActiveTabs('')
        setModalData((prev) => {
            const updatedData = { ...prev, value: page };
            setLinkData((prevState) => ({
                ...prevState,
                [updatedData.id]: {
                    ...prevState[updatedData.id],
                    value: updatedData.value,
                },
            }));
            return updatedData; // Return the updated modalData
        });

        $('#exampleModal').modal('hide'); // Close the modal
    };



    const [pageListTable, setPageListTable] = useState('')

    console.log(pageListTable)


    const { data: page_list = []
    } = useQuery({
        queryKey: ['page_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/page_list/page_list_list`)

            const data = await res.json()
            return data
        }
    })
    const { data: page_list_status = []
    } = useQuery({
        queryKey: ['page_list_status'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/page_list/page_list_list_one`)

            const data = await res.json()
            return data
        }
    })
    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/page_list/all_table_data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pageListTable }) // Sending table name dynamically
                });

                if (response.ok) {
                    const data = await response.json();
                    setTableData(data);  // Store data in state
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [pageListTable]); // Re-fetch if the table name changes

    console.log(tableData)

    const [activeTabs, setActiveTabs] = useState([]); // Manage multiple active tabs


    const handleTabClick = (tabName, tabNames) => {
        setActiveTabs([tabName, tabNames]); // Reset active tabs and add only the clicked tab
    };

    console.log(activeTabs)

    console.log(linkData)

    const router = useRouter()

    const front_service_box_create = (event) => {
        event.preventDefault();

        const form = event.target;
        const photo = form.photo.value

        const allData = {
            linkData, photo, formData
        }

        if (!formData.title) {
            seTitle('This field is required.');
            return; // Prevent further execution
        }
        if (!formData.sort) {
            setSort('This field is required.');
            return; // Prevent further execution
        }
        if (!formData.status) {
            setStatus('This field is required.');
            return; // Prevent further execution
        }

        for (const [key, link] of Object.entries(linkData)) {
            if (!link.name) {
                setName(`Name is required.`);
                return; // Prevent further execution
            }
        }
        console.log(allData)

        console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}/Admin/front_service_box/front_service_box_update/${id}

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/front_service_box/front_service_box_update/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(allData),
        })
            .then((Response) => {

                Response.json()
                if (Response) {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                    router.push('/Admin/front_service_box/front_service_box_all?page_group=dynamic_website')

                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                    router.push('/Admin/front_service_box/front_service_box_all?page_group=dynamic_website')

                }
            })
            .catch((error) => console.error(error));
        // }
    }

    const [statuss, setStatuss] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/all_status`)
            .then(res => res.json())
            .then(data => setStatuss(data))
    }, [])


    const renderLinkRow = (label, id) => (
        <div className="form-group row">
            <label className="col-form-label font-weight-bold col-md-3">{label}:</label>
            <div className="col-md-6">
                <div className="input-group input-group-sm">
                    {/* <select
                        className="form-control form-control-sm link_type w-25"
                        value={linkData[id].type}
                        onChange={(e) => handleSelectChange(id, e.target.value)}
                    >
                        <option value="1">External</option>
                        <option value="2">Front page</option>
                        <option value="3">No Link</option>
                        <option value="4">Content Reference</option>
                    </select> */}
                    <input
                        type="text"
                        className="form-control form-control-sm name_input w-25"
                        value={linkData[id].name}
                        onChange={(e) => handleInputChange(id, 'name', e.target.value)}
                        placeholder="Name"
                    />
                    <select
                        className="form-control form-control-sm link_type w-25"
                        value={
                            linkData[id].value === 'font' ? '2' :
                                linkData[id].value === 'no link' ? '3' :
                                    linkData[id].value.startsWith('https//') ? '1' :
                                        '4' // Default to Content Reference
                        }
                        onChange={(e) => handleSelectChange(id, e.target.value)}
                    >
                        <option value="1">External</option>
                        <option value="2">Front page</option>
                        <option value="3">No Link</option>
                        <option value="4">Content Reference</option>
                    </select>

                    <input
                        type="text"
                        className="form-control form-control-sm select_result w-25"
                        value={linkData[id].value}
                        disabled={!linkData[id].value.startsWith('https//')}
                        onChange={(e) => handleInputChange(id, 'value', e.target.value)}
                    />
                    {linkData[id].type === '4' && (
                        <div className="input-group-append">
                            <span
                                className="input-group-text search_icon"
                                data-toggle={linkData[id].type === '4' ? 'modal' : ''}
                                data-target={linkData[id].type === '4' ? '#exampleModal' : ''}
                                onClick={() => linkData[id].type === '4' && openModal(id)}
                            >
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    )}
                </div>
                { // Display the error message conditionally for this specific link
                    name && !linkData[id].name && <p className="text-danger">{name}</p>
                }
            </div>
        </div>
    );

    return (
        <div className="col-md-12 bg-light p-4">
            <div className="card card-default">
                <div className="card-header py-1 clearfix bg-gradient-primary text-white">
                    <h5 className="card-title font-weight-bold mb-0 float-left mt-1">
                        Edit Front Service Box
                    </h5>
                    <div className="card-title font-weight-bold mb-0 float-right">
                        <Link
                            href="/Admin/front_service_box/front_service_box_all?page_group=dynamic_website"
                            className="btn btn-sm btn-info"
                        >
                            Back to Front service box List
                        </Link>
                    </div>
                </div>
                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                </div>
                <div className="card-body">
                    <form action="" onSubmit={front_service_box_create}>
                        <div class="form-group row">
                            <label class="control-label font-weight-bold col-md-3">Title:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-6">
                                <input type="text" required="" onChange={handleChange} value={formData.title} name="title" class="form-control form-control-sm required alpha_space" id="title" placeholder="Enter Title" />
                                {
                                    title && <p className='text-danger'>{title}</p>
                                }
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label font-weight-bold col-md-3">Sort:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-6">
                                <input type="number" required="" step="1" name="sort" class="form-control form-control-sm required integer" id="sort" placeholder="Enter Sort" onChange={handleChange} value={formData.sort} />
                                {
                                    sort && <p className='text-danger'>{sort}</p>
                                }
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label font-weight-bold col-md-3">Status:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-6">

                                <select onChange={handleChange} value={formData.status} required="" name="status" class="form-control form-control-sm trim integer_no_zero" id="status" placeholder="Enter Status">
                                    <option value="">Select Status</option>
                                    {statuss.map(status =>
                                        <>
                                            <option value={status.id}>{status.status_name}</option>
                                        </>

                                    )
                                    }
                                </select>
                                {
                                    status && <p className='text-danger'>{status}</p>
                                }


                            </div>
                        </div>



                        <div class="form-group row">
                            <label class="control-label font-weight-bold col-md-3">Photo:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div className="col-md-6">
                                <div>
                                    <span className="btn btn-success btn-sm">
                                        <label htmlFor="fileInput" className="mb-0">
                                            <span className="ml-1">Select Image</span>
                                        </label>
                                        <input
                                            name="file_path"
                                            type="file"
                                            id="fileInput"
                                            style={{ display: 'none' }}
                                            onChange={brandFileChange}
                                        />
                                    </span>
                                </div>

                                {fileSizeError && <div className="text-danger m-0">{fileSizeError}</div>}
                                <div id="progress_client" className="progress">
                                    <div
                                        className="progress-bar progress_client1 progress-bar-success"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>

                                <input type="text" className='d-none' value={uploadedFileUrl ? uploadedFileUrl : formData.photo} name='photo' />

                                <div id="software_logo" className="logo bg-light img-thumbnail">
                                    {uploadedFileUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />
                                        :
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${formData.photo}`} alt="Uploaded" className="img-fluid" />

                                    }
                                </div>
                            </div>
                        </div>

                        {renderLinkRow('Link1', 'link1')}
                        {renderLinkRow('Link2', 'link2')}
                        {renderLinkRow('Link3', 'link3')}
                        {renderLinkRow('Link4', 'link4')}
                        {renderLinkRow('Link5', 'link5')}



                        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Content Reference</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div>
                                            <table className="table table-bordered table-striped table-sm" align="center">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Page List</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={(event) => {
                                                                    event.preventDefault(); // Prevent the page reload
                                                                    handleTabClick("pageList");
                                                                }}
                                                            >
                                                                <i className="fas fa-bars"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Content List</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={(event) => {
                                                                    event.preventDefault(); // Prevent the page reload
                                                                    handleTabClick("contentList");
                                                                }}
                                                            >
                                                                <i className="fas fa-bars"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {activeTabs.includes("pageList") && (
                                                <div id="page_list" className="tab-pane">
                                                    <table id="modal-view-list" className="table table-bordered table-striped table-sm" align="center">
                                                        <thead>
                                                            <tr>
                                                                <th>Page Name</th>
                                                                <th>Human Page Link</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {page_list.map(page => (
                                                                <tr
                                                                    onClick={() => saveModalChanges(page.page_link)}
                                                                    key={page.page_name}
                                                                >
                                                                    <td >{page.page_name}</td>
                                                                    <td>{page.page_link}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {activeTabs.includes("contentList") && (
                                                <div id="content_list" className="tab-content">
                                                    <table className="table table-bordered table-striped table-sm" align="center">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {page_list_status.map(pageStatus => (
                                                                <tr key={pageStatus.page_name}>
                                                                    <td>{pageStatus.page_name}</td>
                                                                    <td>
                                                                        <button
                                                                            onClick={(event) => {
                                                                                event.preventDefault();
                                                                                setPageListTable(pageStatus.table_name);
                                                                                handleTabClick("contentLists", "contentList");
                                                                            }}
                                                                            className="btn btn-sm btn-secondary"
                                                                        >
                                                                            <i className="fas fa-bars"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {activeTabs.includes("contentLists") && (
                                                <div id="content_lists" className="tab-pane">
                                                    <table className="table table-bordered table-striped table-sm" align="center">
                                                        <thead>
                                                            <tr>
                                                                <th>Title</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tableData.map(page => (
                                                                <tr onClick={() => saveModalChanges(`${pageListTable}/${page?.id}`)} key={page.id}>
                                                                    <td>{page?.name ? page?.name : page?.title}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        {/* <button onClick={saveModalChanges} type="button" className="btn btn-primary">Save changes</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="offset-md-3 col-sm-6">
                                <input

                                    type="submit"
                                    name="create"
                                    className="btn btn-success btn-sm"
                                    value="Submit"
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FontServiceBoxUpdate;