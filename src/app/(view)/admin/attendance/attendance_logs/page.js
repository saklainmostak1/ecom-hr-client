'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';

const AttendanceLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemName, setItemName] = useState('');
    const [employee, setEmployee] = useState('');
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [month, setMonth] = useState('');
    const [deviceName, setDeviceName] = useState('');

    const { data: branchAll = [], isLoading, refetch } = useQuery({
        queryKey: ['branchAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: designations = [] } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/designation/designation_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });

    const handleBranchChange = (branchId) => {
        setItemName(branchId);
        setSearchQuery('');
        const filteredDesignations = designations.filter(designation =>
            employees.some(employee =>
                employee.branch_id === parseFloat(branchId) && employee.designation_id === designation.id
            )
        );
        setFilteredDesignations(filteredDesignations);

        const filteredEmployees = employees.filter(employee => employee.branch_id === parseFloat(branchId));
        setFilteredEmployees(filteredEmployees);
    };

    const handleDesignationChange = (designationId) => {
        setSearchQuery(designationId);

        const filteredEmployees = employees.filter(employee =>
            employee.branch_id === parseFloat(itemName) && employee.designation_id === parseFloat(designationId)
        );
        setFilteredEmployees(filteredEmployees);
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };
    const generateMonthOptions = () => {
        const options = [];
        const now = new Date();
        let startYear = 2024; // Start from January 2024
        let startMonth = 1; // January

        for (let year = startYear; year <= now.getFullYear(); year++) {
            let month = startMonth;
            if (year === now.getFullYear()) {
                month = 1; // Start from January for the current year
            }
            for (; month <= 12; month++) {
                if (year === now.getFullYear() && month > now.getMonth() + 1) {
                    break; // Stop if we exceed the current month
                }
                const monthName = getMonthName(month);
                options.push({
                    value: `${year}-${month.toString().padStart(2, '0')}`,
                    label: `${monthName} ${year}`
                });
            }
        }
        return options;
    };

    const monthOptions = generateMonthOptions();
    const [dateDisabled, setDateDisabled] = useState(false)
    const [monthName, setMonthName] = useState([])
    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        const selectedMonthName = event.target.options[event.target.selectedIndex].text;
        setMonthName(selectedMonthName)
        setMonth(selectedMonth);

        if (selectedMonth) {
            setDateDisabled(true);
            setShowFromDate(''); // Clear the display value for From Date
            setShowToDate(''); // Clear the display value for To Date
            setFromDate(''); // Clear the From Date value
            setToDate('');
            // Disable date inputs when a month is selected
        } else {
            setDateDisabled(false); // Enable date inputs when no month is selected
        }
    };
    console.log(monthName)

    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');

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



    const [error, setError] = useState([])
    const [loading, setLoading] = useState(false)


    const news_search = () => {
        setLoading(true);
        if (itemName === '') {
            alert('select a branch')
            setLoading(false);
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_search`, {
            itemName, searchQuery, employee, deviceName, fromDate
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

    console.log(searchResults)
    const [errorr, setErrorr] = useState([])

    const attendance_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_search`, {
            itemName, searchQuery, employee, deviceName, fromDate
        });

        const searchResults = response.data.results
        console.log(searchResults)

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
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, selectedPrintSize, fontSize
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
            a.download = 'attendance_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const attendance_print_download = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_search`, {
                itemName, searchQuery, employee, deviceName, fromDate
            });

            const searchResults = response.data.results
                ;

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

            // Get the value of the extra column input field
            // const extraColumnValue = parseInt(document.getElementById('extra_column').value);


            console.log(searchResults);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_prtint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, selectedPrintSize, fontSize
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

    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };


    const attendance_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_log_search`, {
                itemName, searchQuery, employee, deviceName, fromDate
            });
            const searchResults = response.data.results;

            // Define the columns
            const columns = [
                'SL No.',
                'Employee ID',
                'Name',
                'Photo',
                'Designation',
                'Date',
                'Time',

            ];

            // Filter the data
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'SL No.': index + 1,
                    'Employee ID': category.unique_id,
                    'Name': category.full_name,
                    'Photo': category.photo ? `=${process.env.NEXT_PUBLIC_API_URL}:5003/${category.photo}` : '',
                    'Designation': category.designation_name,
                    'Date': showFromDate ? `${showFromDate}` : '',
                    'Time': category.checktime,

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




    const attendance_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_list_search`, {
                itemName, searchQuery, employee, deviceName, fromDate
            });
            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Employee ID',
                'Name',
                'Photo',
                'Designation',
                'Date',
                'Time',
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
                // Debugging: Log the category object to check the data
                console.log('Category:', category);

                // Fetch image data
                const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5003/${category.photo}`);
                const imageData = await imageResponse.blob();
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
                            children: [new Paragraph({ text: category.unique_id ? `${category.unique_id}` : '' })], // Ensure Employee ID is treated as text
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.full_name })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [imageRun] })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.designation_name })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: showFromDate ? showFromDate : `${category.attendance_date}` })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.checktime })],
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


    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

        return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };
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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'attendance')

    //   console.log(filteredModuleInfo);



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );

    const attendance_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/attendance/attendance_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    news_search()
                    console.log(data)
                })
        }
    }
   

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Attendance Log</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/attendance/attendance_create?page_group=`} className="btn btn-sm btn-info">Back To Attendance Create</Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Branch Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={itemName} onChange={(e) => handleBranchChange(e.target.value)} name="branch_id" className="form-control form-control-sm mb-2" id="branch_id">
                                                        <option value=''>Select Branch</option>
                                                        {branchAll.map((branch) => (
                                                            <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2 font-weight-bold">Designation Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={searchQuery} onChange={(e) => handleDesignationChange(e.target.value)} name="designation_id" className="form-control form-control-sm mb-2" id="designation_id">
                                                        <option value=''>Select Designation</option>
                                                        {filteredDesignations.map((designation) => (
                                                            <option key={designation.id} value={designation.id}>{designation.designation_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Employee:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={employee} onChange={(e) => setEmployee(e.target.value)} name="employee_id" className="form-control form-control-sm mb-2" id="employee_id">
                                                        <option value=''>Select Employee</option>
                                                        {filteredEmployees.map((employee) => (
                                                            <option key={employee.id} value={employee.user_id}>{employee.unique_id} - {employee.full_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2 font-weight-bold">Device ID:</label>
                                                <div className="col-md-4">

                                                    <input class="form-control form-control-sm  alpha_space item_name" placeholder='Your Device ID' type="text" value={deviceName}
                                                        onChange={(e) => setDeviceName(e.target.value)} />


                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>Date:</strong></label>

                                                <div className="col-md-4">


                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled={dateDisabled}
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
                                            <div className="form-group row">
                                                <div className="offset-md-2 col-md-10 float-left">
                                                    <input
                                                        onClick={news_search}
                                                        type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                    <input
                                                        onClick={attendance_word_download}
                                                        type="button" name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Doc" />
                                                    <input
                                                        type='button'
                                                        onClick={attendance_excel_download}
                                                        name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Excel" />
                                                    <input
                                                        onClick={attendance_pdf_download}
                                                        type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
                                                    <input
                                                        onClick={attendance_print_download}
                                                        type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>
                                </div>
                            </div>
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
                            <div className='card'>
                                <div className="body-content bg-light">
                                    <div className="border-primary shadow-sm border-0">
                                        <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Attendance List</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((attendances, i) => (
                                                            <tr key={i}>
                                                                <td>{attendances.unique_id}</td>
                                                                <td>{attendances.full_name}</td>
                                                                <td>
                                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${attendances.photo}`} alt="No image found" className="img-fluid" />
                                                                </td>
                                                                <td>{attendances.designation_name}</td>

                                                                <td>
                                                                    {attendances.attendance_date.slice(0, 10)}
                                                                </td>

                                                                <td>{formatDate(attendances.checktime)}</td>
                                                                <td>

                                                                    <div className="flex items-center ">


                                                                        {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                            <button
                                                                                key={filteredBtnIconDelete.id}
                                                                                title='Delete'
                                                                                onClick={() => attendance_delete(attendances.id)}
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
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceLogs;
