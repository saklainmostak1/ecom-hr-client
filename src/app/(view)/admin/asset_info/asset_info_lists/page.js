'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';

const AssetInfoLists = ({ searchParams }) => {


    const [assenTypeName, setAssetTypeName] = useState('')
    const [status, setStatus] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorr, setErrorr] = useState(null)
    const [assetType, setAssetType] = useState('')
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');

    const { data: asset_infoAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['asset_infoAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: asset_typeAll = [],
    } = useQuery({
        queryKey: ['asset_typeAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_type/asset_type_all`)

            const data = await res.json()
            return data
        }
    })


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

    const [userId, setUserId] = useState(() => {
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

    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'asset_info')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );

    // Paigination start
    const parentUsers = asset_infoAll

    const totalData = parentUsers?.length
    const dataPerPage = 20

    const totalPages = Math.ceil(totalData / dataPerPage)

    let currentPage = 1


    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page)
    }


    let pageNumber = []
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue
        }
        if (index > totalPages) {
            break
        }
        pageNumber.push(index)
    }
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_list_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    const asset_info_delete = id => {


        console.log(id);


        // const proceed = window.confirm(`Are You Sure delete${id}`)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_delete/${id}`, {
            method: "POST",
        })
            .then(response => {
                console.log(response)
                response.json()
                if (response.ok === true) {
                    const procced = window.confirm(`Are You Sure delete`)
                    if (procced)
                        refetch();
                    caregory_list()


                }
                else {
                    alert('Data already running. You cant Delete this item.');
                }
            })
            .then(data => {
                if (data) {

                    console.log(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the data. Please try again.');
            });
    }

    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])


    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');


    const handleDateChangess = (event) => {
        const selectedDate = new Date(event.target.value);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = String(selectedDate.getFullYear()); // Get last two digits of the year
        const formattedDate = `${day}-${month}-${year}`;
        setShowFromDate(formattedDate);
        setFromDate(selectedDate);
    };

    // Open date picker when text input is clicked
    const handleTextInputClick = () => {
        document.getElementById('dateInput').showPicker();
    };

    const handleDateChangesss = (event) => {
        const selectedDate = new Date(event.target.value);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = String(selectedDate.getFullYear()); // Get last two digits of the year
        const formattedDate = `${day}-${month}-${year}`;
        setShowToDate(formattedDate);
        setToDate(selectedDate);
    };

    // Open date picker when text input is clicked
    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };


    const asset_type_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_search`, {
            assenTypeName, status, assetType, toDate, fromDate

        })
            .then(response => {
                setSearchResults(response.data.results);
                setError(null);
                setLoading(false);
                if (response.data.results == '') {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };



    const [statuss, setStatuss] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/all_status`)
            .then(res => res.json())
            .then(data => setStatuss(data))
    }, [])




    const asset_info_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_search`, {
            assenTypeName, status, assetType, toDate, fromDate
        });

        const searchResults = response.data.results

        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        const selectedPrintSize = document.getElementById('print_size').value;
        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }
        // Set the page dimensions based on the selected print size
        let pageWidth, pageHeight;
        switch (selectedPrintSize) {
            case 'A4':
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
            case 'A3':
                pageWidth = 297 * zoomMultiplier;
                pageHeight = 420 * zoomMultiplier;
                break;
            case 'legal':
                pageWidth = 216 * zoomMultiplier; // Width for Legal size
                pageHeight = 356 * zoomMultiplier; // Height for Legal size
                break;
            default:
                // Default to A4 size
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }



        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;


        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize
                    // Other parameters if needed
                }),

                // If you need to send any data with the request, you can include it here
                // body: JSON.stringify({ /* your data */ }),
            });

            if (!response.ok) {
                throw new Error('Error generating PDF In Period');
            }


            // If you want to download the PDF automatically
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'period_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const asset_type_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_search`, {
                assenTypeName, status, assetType, toDate, fromDate
            });

            const searchResults = response.data.results;

            console.log(searchResults);

            const selectedLayout = document.getElementById('print_layout').value;
            const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

            const selectedPrintSize = document.getElementById('print_size').value;
            const selectedZoom = document.querySelector('.zoom_size').value;

            // Convert zoom value to a numeric multiplier
            let zoomMultiplier = 100; // Default zoom multiplier
            if (selectedZoom !== '') {
                zoomMultiplier = parseFloat(selectedZoom) / 100;
            }
            // Set the page dimensions based on the selected print size
            let pageWidth, pageHeight;
            switch (selectedPrintSize) {
                case 'A4':
                    pageWidth = 210 * zoomMultiplier;
                    pageHeight = 297 * zoomMultiplier;
                    break;
                case 'A3':
                    pageWidth = 297 * zoomMultiplier;
                    pageHeight = 420 * zoomMultiplier;
                    break;
                case 'legal':
                    pageWidth = 216 * zoomMultiplier; // Width for Legal size
                    pageHeight = 356 * zoomMultiplier; // Height for Legal size
                    break;
                default:
                    // Default to A4 size
                    pageWidth = 210 * zoomMultiplier;
                    pageHeight = 297 * zoomMultiplier;
                    break;
            }



            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize, extraColumnValue
                }),
            });

            const htmlText = await html.text();

            printWindow.document.write(htmlText);
            printWindow.document.close(); // Ensure the document is completely loaded before printing
            printWindow.focus();
        } catch (error) {
            console.error('Error generating print view:', error.message);
        }
    };


    const asset_info_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_search`, {
                assenTypeName, status, assetType, toDate, fromDate
            });
            const searchResults = response.data.results;

            // Define the columns
            const columns = [
                'SL No.',
                'Asset Name',
                'Asset Type Name',
                'Status',
                'Img',
                'Description',

            ];

            // Filter the data
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'SL No.': index + 1,
                    'Asset Name': category.asset_name,
                    'Asset Type Name': category.asset_type_name,
                    'status': category.status === 1 ? "Active"
                        : category.status === 2 ? "Inactive"
                            : category.status === 3 ? "Pending"
                                : "Unknown",
                    'Img': category.photo ? `=${process.env.NEXT_PUBLIC_API_URL}:5003/${category.img}` : '',
                    'Description': category.note,

                };
                return filteredData;
            });

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

            // Calculate width for each column
            const columnWidth = 100 / columns.length;

            // Set width for each column
            const columnWidths = columns.map(() => ({ wpx: columnWidth * columns.length }));

            worksheet['!cols'] = columnWidths;
            console.log(columnWidths);

            // Create workbook and write to file
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'attendance_results.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };


    const asset_info_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/asset_info/asset_info_search`, {
                assenTypeName, status, assetType, toDate, fromDate
            });
            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Asset Name',
                'Asset Type Name',
                'Img',
                'Status',
                'Description',

            ];

            // Create header row
            const headerRow = new TableRow({
                children: columns.map(column => new TableCell({
                    children: [new Paragraph({ text: column, bold: true })],
                    borders: {},
                })),
            });

            // Create data rows
            const dataRows = await Promise.all(searchResults.map(async (category, index) => {
                // Fetch image data
                const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5003/${category.img ? category.img : 'No Image Found'}`);
                const imageData = await imageResponse?.blob();
                const imageRun = new ImageRun({
                    data: imageData,
                    transformation: {
                        width: 100,
                        height: 100,
                    }
                });

                return new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `${index + 1}` })], // Ensure SL No. is treated as text
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.asset_name ? `${category.asset_name}` : '' })], // Ensure Employee ID is treated as text
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.asset_type_name })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [imageRun] })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.status === 1 ? "Active"
                                : category.status === 2 ? "Inactive"
                                    : category.status === 3 ? "Pending"
                                        : "Unknown", })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.note })],
                            borders: {},
                        }),
                       
                    ],
                });
            }));

            const table = new Table({
                rows: [headerRow, ...dataRows],
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                columnWidths: columns.map(() => 100 / columns.length),
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("News List")
                            ],
                            alignment: 'center',
                        }),
                        table, // Add the table to the document
                    ],
                }],
            });

            const buffer = await Packer.toBuffer(doc);
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'attendance_results.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Asset Info Search</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
                                            <div class="form-group row student">

                                                <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>From Date:</strong></label>

                                                <div className="col-md-4">


                                                    <input
                                                        type="text"
                                                        readOnly

                                                        value={showFromDate}
                                                        onClick={handleTextInputClick}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control form-control-sm"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInput"
                                                        onChange={handleDateChangess}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />


                                                </div>

                                                <label htmlFor="toDate" class="col-form-label col-md-2"><strong>To Date:</strong></label>
                                                <div class="col-md-4">
                                                    <input
                                                        type="text"
                                                        readOnly

                                                        value={showToDate}
                                                        onClick={handleTextInputClicks}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control form-control-sm"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInputTo"
                                                        onChange={handleDateChangesss}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />

                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Asset Name:</strong></label>

                                                <div className="col-md-4">
                                                    <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                        placeholder='Asset Name'
                                                        value={assenTypeName} onChange={(e) => setAssetTypeName(e.target.value)}

                                                    />

                                                </div>

                                                <label className="col-form-label col-md-2"><strong>Status:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={status} onChange={(e) => setStatus(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Status</option>
                                                        {
                                                            statuss.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.status_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">


                                                <label className="col-form-label col-md-2"><strong>Asset Type:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={assetType} onChange={(e) => setAssetType(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Asset Type</option>
                                                        {
                                                            asset_typeAll.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.asset_type_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-2"><strong>Extra Column:</strong></label>
                                                <div className="col-md-10">
                                                    <select name="extra_column" className="form-control form-control-sm alpha_space extra_column" id="extra_column" placeholder="Extra Column">
                                                        {(() => {
                                                            const options = [];
                                                            for (let i = 0; i <= 100; i++) {
                                                                options.push(<option key={i} value={i}>{i}</option>);
                                                            }
                                                            return options;
                                                        })()}
                                                    </select>
                                                </div>


                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
                                                <div class="col-md-10">
                                                    <div class="input-group ">
                                                        <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                            <option value="legal">legal </option>
                                                            <option value="A4">A4 </option>
                                                            <option value="A3">A3 </option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="landscape">Landscape</option>
                                                            <option value="portrait">Portrait</option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                        </select>
                                                        <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
                                                            <option value="font-12">Font Standard</option>
                                                            <option value="font-10">Font Small</option>

                                                        </select>
                                                        <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
                                                            <option value="120%">Browser Zoom</option>
                                                            <option value="5%">5% Zoom</option>
                                                            <option value="10%">10% Zoom</option>
                                                            <option value="15%">15% Zoom</option>
                                                            <option value="20%">20% Zoom</option>
                                                            <option value="25%">25% Zoom</option>
                                                            <option value="30%">30% Zoom</option>
                                                            <option value="35%">35% Zoom</option>
                                                            <option value="40%">40% Zoom</option>
                                                            <option value="45%">45% Zoom</option>
                                                            <option value="50%">50% Zoom</option>
                                                            <option value="55%">55% Zoom</option>
                                                            <option value="60%">60% Zoom</option>
                                                            <option value="65%">65% Zoom</option>
                                                            <option value="70%">70% Zoom</option>
                                                            <option value="75%">75% Zoom</option>
                                                            <option value="80%">80% Zoom</option>
                                                            <option value="85%">85% Zoom</option>
                                                            <option value="90%">90% Zoom</option>
                                                            <option value="95%">95% Zoom</option>
                                                            <option value="100%" selected="">100% Zoom</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={asset_type_search}
                                                />
                                                <input
                                                    onClick={asset_info_pdf_download}
                                                    type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />
                                                <input
                                                    onClick={asset_info_excel_download}
                                                    type="button" name="summary" class="btn btn-sm btn-primary print_summary ml-2" value="Download Excel" />
                                                <input
                                                    onClick={asset_info_word_download}
                                                    type="button" name="summary" class="btn btn-sm btn-danger print_summary ml-2" value="Download Word" />
                                                <input
                                                    onClick={asset_type_print}

                                                    type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Asset Info</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/asset_info/asset_info_create?page_group`} className="btn btn-sm btn-info">Asset Info Create</Link>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className='text-center'>
                                        <div className='text-center text-dark'>
                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                        </div>
                                    </div>
                                ) : (


                                    searchResults?.length > 0 ? (
                                        <div class="card-body">
                                            <div className='table-responsive'>
                                                <div className=" d-flex justify-content-between">
                                                    <table className="table  table-bordered table-hover table-striped table-sm">

                                                        <thead>

                                                            <tr>
                                                                <th>

                                                                    SL No.
                                                                </th>
                                                                <th>

                                                                    Asset  Name
                                                                </th>
                                                                <th>
                                                                    Asset Type Name
                                                                </th>
                                                                <th>
                                                                    Status
                                                                </th>
                                                                <th>
                                                                    Description
                                                                </th>
                                                                <th>
                                                                    Img
                                                                </th>

                                                                <th>
                                                                    Action
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>
                                                            {isLoading ? <div className='text-center'>
                                                                <div className='  text-center text-dark'
                                                                >
                                                                    <FontAwesomeIcon style={{
                                                                        height: '33px',
                                                                        width: '33px',
                                                                    }} icon={faSpinner} spin />
                                                                </div>
                                                            </div>
                                                                :
                                                                searchResults.map((asset_info, i) => (
                                                                    <tr key={asset_info.id}>
                                                                        <td>    {i + 1}</td>

                                                                        <td>
                                                                            {asset_info?.asset_name}
                                                                        </td>

                                                                        <td>
                                                                            {asset_info.asset_type_name}
                                                                        </td>
                                                                        <td>
                                                                            {asset_info.status === 1 ? "Active"
                                                                                : asset_info.status === 2 ? "Inactive"
                                                                                    : asset_info.status === 3 ? "Pending"
                                                                                        : "Unknown"}
                                                                        </td>

                                                                        <td>
                                                                            {asset_info.note}
                                                                        </td>
                                                                        <td>
                                                                            <>
                                                                                <img
                                                                                    className=" img-thumbnail"
                                                                                    style={{ width: '100px' }}
                                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${asset_info.img}`}
                                                                                    alt="No Image"
                                                                                />
                                                                            </>
                                                                        </td>

                                                                        <td>

                                                                            <div className="flex items-center ">
                                                                                <Link href={`/Admin/asset_info/asset_info_edit/${asset_info.id}?page_group=${page_group}`}>
                                                                                    {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                        <button
                                                                                            key={filteredBtnIconEdit.id}
                                                                                            title='Edit'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconEdit?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                </Link>
                                                                                {/* <Link href={`/Admin/asset_info/asset_info_copy/${asset_info.id}?page_group=${page_group}`}>
        {filteredBtnIconCopy.map((filteredBtnIconEdit => (
            <button
                key={filteredBtnIconEdit.id}
                title='Copy'
                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                className={filteredBtnIconEdit?.btn}
            >
                <a
                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                ></a>
            </button>
        )))}
    </Link> */}
                                                                                {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                    <button
                                                                                        key={filteredBtnIconDelete.id}
                                                                                        title='Delete'
                                                                                        onClick={() => asset_info_delete(asset_info.id)}
                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                        className={filteredBtnIconDelete?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                        ></a>
                                                                                    </button>
                                                                                )))}
                                                                            </div></td>
                                                                    </tr>
                                                                )

                                                                )



                                                            }
                                                        </tbody>


                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                    ) : (

                                        <div class="card-body">
                                            <div className='table-responsive'>
                                                <div className=" d-flex justify-content-between">
                                                    <div>
                                                        Total Data: {totalData}
                                                    </div>
                                                    <div class="pagination float-right pagination-sm border">
                                                        {
                                                            currentPage - 3 >= 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/asset_info/asset_info_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                                <table className="table  table-bordered table-hover table-striped table-sm">
                                                    <thead>

                                                        <tr>
                                                            <th>
                                                                SL No.
                                                            </th>
                                                            <th>

                                                                Asset  Name
                                                            </th>
                                                            <th>
                                                                Asset Type Name
                                                            </th>
                                                            <th>
                                                                Status
                                                            </th>
                                                            <th>
                                                                Description
                                                            </th>
                                                            <th>
                                                                Img
                                                            </th>

                                                            <th>
                                                                Action
                                                            </th>
                                                        </tr>

                                                    </thead>

                                                    <tbody>
                                                        {isLoading ? <div className='text-center'>
                                                            <div className='  text-center text-dark'
                                                            >
                                                                <FontAwesomeIcon style={{
                                                                    height: '33px',
                                                                    width: '33px',
                                                                }} icon={faSpinner} spin />
                                                            </div>
                                                        </div>
                                                            :
                                                            pageUsers.map((asset_info, i) => (
                                                                <tr key={asset_info.id}>
                                                                    <td>    {i + 1}</td>

                                                                    <td>
                                                                        {asset_info?.asset_name}
                                                                    </td>

                                                                    <td>
                                                                        {asset_info.asset_type_name}
                                                                    </td>
                                                                    <td>
                                                                        {asset_info.status === 1 ? "Active"
                                                                            : asset_info.status === 2 ? "Inactive"
                                                                                : asset_info.status === 3 ? "Pending"
                                                                                    : "Unknown"}
                                                                    </td>

                                                                    <td>
                                                                        {asset_info.note}
                                                                    </td>
                                                                    <td>
                                                                        <>
                                                                            <img
                                                                                className=" img-thumbnail"
                                                                                style={{ width: '100px' }}
                                                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${asset_info.img}`}
                                                                                alt="No Image"
                                                                            />
                                                                        </>
                                                                    </td>

                                                                    <td>

                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/asset_info/asset_info_edit/${asset_info.id}?page_group=${page_group}`}>
                                                                                {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                    <button
                                                                                        key={filteredBtnIconEdit.id}
                                                                                        title='Edit'
                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                        className={filteredBtnIconEdit?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                        ></a>
                                                                                    </button>
                                                                                )))}
                                                                            </Link>
                                                                            {/* <Link href={`/Admin/asset_info/asset_info_copy/${asset_info.id}?page_group=${page_group}`}>
                                                                            {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                                <button
                                                                                    key={filteredBtnIconEdit.id}
                                                                                    title='Copy'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconEdit?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                        </Link> */}
                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => asset_info_delete(asset_info.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                        </div></td>
                                                                </tr>
                                                            )

                                                            )



                                                        }
                                                    </tbody>

                                                </table>
                                                <div className=" d-flex justify-content-between">
                                                    <div>
                                                        Total Data: {totalData}
                                                    </div>
                                                    <div class="pagination float-right pagination-sm border">
                                                        {
                                                            currentPage - 3 >= 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/asset_info/asset_info_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/asset_info/asset_info_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    )
                                )}



                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default AssetInfoLists;