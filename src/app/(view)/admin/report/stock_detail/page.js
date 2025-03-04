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




const StockDetails = () => {

    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchResults, setSearchResults] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorr, setErrorr] = useState(null)
    const [supplier_id, setSupplier_id] = useState('')
    const [product_id, setProduct_id] = useState('')




    const { data: purchase_product_stock_list = [], isLoading, refetch
    } = useQuery({
        queryKey: ['purchase_product_stock_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list`)

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




    const purchase_product_stock_list_search = () => {

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list_search`, {
            toDate, fromDate, supplier_id, product_id

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

    const { data: subCategories = [],
    } = useQuery({
        queryKey: ['subCategories'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/sub_category/sub_category_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: categorys = [],
    } = useQuery({
        queryKey: ['categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/category/category_all`)

            const data = await res.json()
            return data
        }
    })


    const stock_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list_search`, {
            toDate, fromDate, supplier_id, product_id
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/stock/stock_details_pdf`, {
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
            a.download = 'purchase_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };

    console.log(error)
    console.log(errorr)

    const stock_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list_search`, {
                toDate, fromDate, supplier_id, product_id
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

            console.log(zoomMultiplier)

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Admin/stock/stock_details_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue
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


    const stock_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list_search`, {
                toDate, fromDate, supplier_id, product_id
            });

            const searchResults = response.data.results;


            // Define the columns
            const columns = [
                'SL No.',
                'Product Name',
                'Category',
                'Sub Category',
                'Purchase Price',
                'Sale Price',
                'Quantity',


            ];


            // Filter the data
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'SL No.': index + 1,
                    'Product Name': category.product_name,
                    'Category': category.category_name,
                    'Sub Category': category.sub_category_name,
                    'Purchase Price': category.purchase_price,
                    'Sale Price': category.sale_price,
                    'Quantity': category.purchase_product_quantity - category.sale_product_quantity,

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
            XLSX.writeFile(workbook, 'Purchase.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };


    const stock_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Admin/purchase/purchase_product_stock_list_search`, {
                toDate, fromDate, supplier_id, product_id
            });

            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Product Name',
                'Category',
                'Sub Category',
                'Purchase Price',
                'Sale Price',
                'Quantity',


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



                // Check and handle missing or undefined amount
                const purchase_product_quantity = category.purchase_product_quantity != null ? parseFloat(category.purchase_product_quantity) : 0;
                const sale_product_quantity = category.sale_product_quantity != null ? parseFloat(category.sale_product_quantity) : 0;
                const purchase_price = category.purchase_price != null ? parseFloat(category.purchase_price) : 0;
                const sale_price = category.sale_price != null ? parseFloat(category.sale_price) : 0;

                // Calculate quantity
                const quantity = purchase_product_quantity - sale_product_quantity;

                return new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `${index + 1}` })], // SL No.
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.product_name ? `${category.product_name}` : '' })], // Name
                            borders: {},
                        }),

                        new TableCell({
                            children: [new Paragraph({ text: category.category_name || '' })], // Email
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.sub_category_name || '' })], // Email
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: `${purchase_price}` })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: `${sale_price}` })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: `${quantity}` })], // Contact Number
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
                                new TextRun("Stock List")
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
            link.download = 'Purchase.docx';
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


                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Stock Product Search</h5>
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
                                                <label className="col-form-label col-md-2"><strong>Product Category:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={supplier_id} onChange={(e) => setSupplier_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Catgeory Name</option>
                                                        {
                                                            categorys.map(subCat =>
                                                                <>
                                                                    <option value={subCat.id}>{subCat.category_name}</option>
                                                                </>
                                                            )
                                                        }
                                                    </select>


                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Product Sub Category:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={product_id} onChange={(e) => setProduct_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Sub Category Name</option>
                                                        {
                                                            subCategories.map(subCat =>
                                                                <>
                                                                    <option value={subCat.id}>{subCat.sub_category_name}</option>
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
                                                    onClick={purchase_product_stock_list_search}
                                                />
                                                <input
                                                    onClick={stock_pdf_download}
                                                    type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />
                                                <input
                                                    onClick={stock_excel_download}
                                                    type="button" name="summary" class="btn btn-sm btn-primary print_summary ml-2" value="Download Excel" />
                                                <input
                                                    onClick={stock_word_download}

                                                    type="button" name="summary" class="btn btn-sm btn-danger print_summary ml-2" value="Download Word" />
                                                <input
                                                    onClick={stock_print}
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
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Stock Product</h5>

                                </div>

                                {loading ? (
                                    <div className='text-center'>
                                        <div className='text-center text-dark'>
                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                        </div>
                                    </div>
                                ) : (


                                    searchResults?.length > 0 ? (


                                        <>
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
                                                                        Product Name
                                                                    </th>
                                                                    <th>
                                                                        Category
                                                                    </th>
                                                                    <th>
                                                                        Sub Category
                                                                    </th>
                                                                    <th>
                                                                        Purchase Price
                                                                    </th>
                                                                    <th>
                                                                        Sale Price
                                                                    </th>
                                                                    <th>
                                                                        Quantity
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
                                                                    searchResults.map((loan, i) => (
                                                                        <tr key={loan.id}>
                                                                            <td>    {i + 1}</td>
                                                                            <td>    {loan.product_name}</td>
                                                                            <td>    {loan.category_name}</td>
                                                                            <td>    {loan.sub_category_name}</td>
                                                                            <td>    {loan.purchase_price}</td>
                                                                            <td>    {loan.sale_price}</td>

                                                                            <td>    {loan.purchase_product_quantity - loan.sale_product_quantity}</td>











                                                                        </tr>
                                                                    )

                                                                    )



                                                                }
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (



                                        <div class="card-body">
                                            <div className='table-responsive'>

                                                <table className="table  table-bordered table-hover table-striped table-sm">
                                                    <thead>

                                                        <tr>
                                                            <th>

                                                                SL No.
                                                            </th>
                                                            <th>
                                                                Product Name
                                                            </th>
                                                            <th>
                                                                Category
                                                            </th>
                                                            <th>
                                                                Sub Category
                                                            </th>
                                                            <th>
                                                                Purchase Price
                                                            </th>
                                                            <th>
                                                                Sale Price
                                                            </th>
                                                            <th>
                                                                Quantity
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
                                                            purchase_product_stock_list.map((loan, i) => (
                                                                <tr key={loan.id}>
                                                                    <td>    {i + 1}</td>
                                                                    <td>    {loan.product_name}</td>
                                                                    <td>    {loan.category_name}</td>
                                                                    <td>    {loan.sub_category_name}</td>
                                                                    <td>    {loan.purchase_price}</td>
                                                                    <td>    {loan.sale_price}</td>

                                                                    <td>    {loan.purchase_product_quantity - loan.sale_product_quantity}</td>



                                                                </tr>
                                                            )

                                                            )



                                                        }
                                                    </tbody>

                                                </table>

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

export default StockDetails;