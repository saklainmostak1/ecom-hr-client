'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';



const LaonCreates = () => {

    const [page_group, setPageGroup] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPageGroup(storedUserId);
        }
    }, []);


    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    const [fromDate, setFromDate] = useState('');


    const [assetInfo, setAssetInfo] = useState({
        loan_authority: '', account: '', loan_reason: '', reference: '', loan_type: '', amount: '', interest: '', payment_type: '', duration: '', per_month: '', payable_amount: '', loan_date: '', note: '', status: '', created_by: created, img: ''
    });

    useEffect(() => {
        const amount = parseFloat(assetInfo.amount) || 0;
        const payable_amount = parseFloat(assetInfo.interest) || 0;

        setAssetInfo(prevState => ({
            ...prevState,
            payable_amount: amount + payable_amount
        }));
    }, [assetInfo.amount, assetInfo.interest]);

    const [selectedEntryType, setSelectedEntryType] = useState('');



    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
    };

    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setFromDate(formattedDate);
        setAssetInfo(prevData => ({
            ...prevData,
            loan_date: formattedDatabaseDate // Update the dob field in the state
        }));
        if (formattedDatabaseDate) {
            setLoan_date('')
        }
    };

    useEffect(() => {
        const dob = assetInfo.loan_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [assetInfo]);




    const { data: loan_authority = [], isLoading, refetch } = useQuery({
        queryKey: ['loan_authority'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_authority/loan_authority_all`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });

    const { data: account_head = [], } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });




    const [selectedFile, setSelectedFile] = useState(Array(assetInfo.length).fill(null));

    // const brand_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };

    const { data: payment_types = [], } = useQuery({
        queryKey: ['payment_type'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_payment/loan_payment_type_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    const [fileNames, setFileNames] = useState([]);


    let [file_size_error, set_file_size_error] = useState(null);
    const brand_file_change = (e) => {
        // e?.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files?.name?.split('.')[0]
        const extension = files?.name?.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'loan/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;


        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error("");
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            setAssetInfo((prevAssetInfo) => ({
                ...prevAssetInfo,
                img: newSelectedFiles[0]?.path
            }));
            upload(files);
        } else {
            console.log('checking the file size is High');
            set_file_size_error("Max file size 2 MB");
            // newSelectedFiles[index] = null;
            // setSelectedFile(newSelectedFiles);
            // setFileNames(null);
        }


        // setFileNames(newName);
        // setSelectedFile(newSelectedFiles);
        // upload(files);
    };

    console.log(fileNames);

    const upload = (file) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/loan/loan_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };




    console.log(assetInfo)


    const [loan_authoritys, setLoan_authority] = useState('')
    const [account, setAccount] = useState('')
    const [loan_reason, setLoan_reason] = useState('')
    const [reference, setReference] = useState('')
    const [loan_type, setLoan_type] = useState('')
    const [amount, setAmount] = useState('')
    const [interest, setInterest] = useState('')
    const [payment_type, setPayment_type] = useState('')
    const [duration, setDuration] = useState('')
    const [per_month, setPer_month] = useState('')
    const [payable_amount, setPayable_amount] = useState('')
    const [loan_date, setLoan_date] = useState('')
    const [error, setError] = useState([]);

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        setAssetInfo(attribute)
        // setSameBrandName('')

        const status = attribute['status'];
        if (status) {
            setError(""); // Clear the error message
        }
        const loan_authority = attribute['loan_authority'];
        if (loan_authority) {
            setLoan_authority(""); // Clear the error message
        }

        const account = attribute['account'];
        if (account) {
            setAccount(""); // Clear the error message
        }

        const loan_reason = attribute['loan_reason'];
        if (loan_reason) {
            setLoan_reason(""); // Clear the error message
        }

        const reference = attribute['reference'];
        if (reference) {
            setReference(""); // Clear the error message
        }

        const loan_type = attribute['loan_type'];
        if (loan_type) {
            setLoan_type(""); // Clear the error message
        }
        const amount = attribute['amount'];
        if (amount) {
            setAmount(""); // Clear the error message
        }

        const interest = attribute['interest'];
        if (interest) {
            setInterest(""); // Clear the error message
        }

        const payment_type = attribute['payment_type'];
        if (payment_type) {
            setPayment_type(""); // Clear the error message
        }

        const duration = attribute['duration'];
        if (duration) {
            setDuration(""); // Clear the error message
        }
        const per_month = attribute['per_month'];
        if (per_month) {
            setPer_month(""); // Clear the error message
        }

        const payable_amount = attribute['payable_amount'];
        if (payable_amount) {
            setPayable_amount(""); // Clear the error message
        }

    };

    const router = useRouter()

    const brand_update = (e) => {
        e.preventDefault();
        const form = e.target; // Access the form

        // if (!assetInfo.asset_name) {
        //     setBrandName('Please enter a brand name.');
        //     return; // Prevent further execution
        // }

        // if (!assetInfo.status) {
        //     setError('Please select a status.');
        //     return; // Prevent further execution
        // }



        // if (!assetInfo.status) {
        //     return setError("Select A Status"); // Clear the error message
        // }

        // if (!assetInfo.loan_authority) {
        //     return setLoan_authority("Select A Loan Authority Name"); // Clear the error message
        // }


        // if (!assetInfo.account) {
        //     return setAccount("Enter Account"); // Clear the error message
        // }


        // if (!assetInfo.loan_reason) {
        //     return setLoan_reason("Enter Loan Reason"); // Clear the error message
        // }


        // if (!assetInfo.reference) {
        //     return setReference("Enter Referense"); // Clear the error message
        // }
        // if (!assetInfo.loan_type) {
        //     return setLoan_type("Enter Loan Type"); // Clear the error message
        // }
        // if (!assetInfo.loan_date) {
        //     return setLoan_date("Enter Loan Date"); // Clear the error message
        // }

        // if (assetInfo.loan_type === 'cash') {
        //     if (!assetInfo.amount) {
        //         return setAmount("Enter Amount"); // Clear the error message
        //     }

        //     if (!assetInfo.interest) {
        //         return setInterest("Enter Interest"); // Clear the error message
        //     }


        //     if (!assetInfo.payment_type) {
        //         return setPayment_type("Enter Payment Type"); // Clear the error message
        //     }
        //     if (!assetInfo.duration) {
        //         return setDuration("Enter Duration"); // Clear the error message
        //     }

        //     if (!assetInfo.per_month) {
        //         return setPer_month("Enter Per month"); // Clear the error message
        //     }


        //     if (!assetInfo.payable_amount) {
        //         return setPayable_amount("Enter Payable Amount"); // Clear the error message
        //     }

        // }

        // else {
        //     setPayable_amount('')
        //     setPer_month('')
        //     setDuration('')
        //     setPayment_type('')
        //     setInterest('')
        //     setAmount('')
        // }







        // Retrieve the form's image value


        // Make the fetch request
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan/loan_create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetInfo)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push(`/Admin/loan/loan_all?page_group=${page_group}`);
                }
            })
            .catch(error => {
                console.error('Error updating brand:', error);
            });
    };


    const brand_combined_change = (e) => {


        brand_file_change(e);
    };



    const brand_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = assetInfo.img;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update assetInfo to remove the file path
                        setAssetInfo(prevData => ({
                            ...prevData,
                            img: '',
                        }));
                    })
                    .catch(err => {
                        console.error(`Error deleting file ${filePathToDelete}:`, err);
                    });
            }
        }
    };



    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    console.log(selectedEntryType)

    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Loan</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/loan/loan_all?page_group=${page_group}`} class="btn btn-sm btn-info">Loan List</Link></div>
                            </div>
                            <form action="" onSubmit={brand_update}>
                                <div class="card-body">

                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Authority Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.loan_authority}
                                                        onChange={
                                                            brand_input_change
                                                        }
                                                        name='loan_authority'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Loan Authority Name</option>
                                                        {
                                                            loan_authority.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        loan_authoritys && <p className='text-danger'>{loan_authoritys}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Payment Type :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.payment_type} onChange={brand_input_change}
                                                        name='payment_type'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Payment Type</option>
                                                        {
                                                            payment_types.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.payment_type_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        payment_type && <p className='text-danger'>{payment_type}</p>
                                                    }
                                                </div>
                                            </div>



                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Account:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.account} onChange={brand_input_change}
                                                        name='account'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Account</option>
                                                        {
                                                            account_head.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.account_head_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        account && <p className='text-danger'>{account}</p>
                                                    }

                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Reason<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <textarea
                                                        value={assetInfo.loan_reason} onChange={brand_input_change}
                                                        name="loan_reason"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter Loan Reason"
                                                        rows={2}
                                                        cols={20}
                                                        // style={{ width: '550px', height: '100px' }}
                                                        maxLength={500}
                                                    ></textarea>

                                                    {assetInfo.loan_reason.length > 255 && (
                                                        <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                    )}

                                                    {
                                                        loan_reason && <p className='text-danger'>{loan_reason}</p>
                                                    }

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Reference<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="text" name="reference" value={assetInfo.reference} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Reference'
                                                        maxLength={256}
                                                    />

                                                    {
                                                        reference && <p className='text-danger'>{reference}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="amount" value={assetInfo.amount} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Amount'
                                                        maxLength={256}
                                                    />

                                                    {
                                                        amount && <p className='text-danger'>{amount}</p>
                                                    }
                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Interest<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="interest" value={assetInfo.interest} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Interest'
                                                        maxLength={256}
                                                    />

                                                    {
                                                        interest && <p className='text-danger'>{interest}</p>
                                                    }
                                                </div>
                                            </div>


                                        </div>

                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Payable Amount:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="payable_amount" value={assetInfo.payable_amount} onChange={brand_input_change}
                                                    readOnly
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Interest'
                                                        maxLength={256}
                                                    />
                                                    {
                                                        payable_amount && <p className='text-danger'>{payable_amount}</p>
                                                    }

                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Type:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.loan_type} onChange={(e) => {
                                                            brand_input_change(e);
                                                            handleEntryTypeChange(e);
                                                        }}
                                                        name='loan_type'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Loan Type</option>
                                                        <option value='term'>Term</option>
                                                        <option value='cash'>Cash</option>

                                                    </select>
                                                    {
                                                        loan_type && <p className='text-danger'>{loan_type}</p>
                                                    }

                                                </div>
                                            </div>
                                            {selectedEntryType == 'term' ?


                                                <>




                                                    <div class="form-group row">
                                                        <label class="col-form-label col-md-3"><strong>Duration<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                        <div class="col-md-8">
                                                            <input type="number" name="duration" value={assetInfo.duration} onChange={brand_input_change}
                                                                class="form-control form-control-sm  required "
                                                                placeholder='Enter  Duration'
                                                                maxLength={256}
                                                            />

                                                            {
                                                                duration && <p className='text-danger'>{duration}</p>
                                                            }
                                                        </div>
                                                    </div>


                                                    <div class="form-group row">
                                                        <label class="col-form-label col-md-3"><strong>Per Month<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                        <div class="col-md-8">
                                                            <input type="number" name="per_month" value={assetInfo.per_month} onChange={brand_input_change}
                                                                class="form-control form-control-sm  required "
                                                                placeholder='Enter  Per Month'
                                                                maxLength={256}
                                                            />
                                                            {
                                                                per_month && <p className='text-danger'>{per_month}</p>
                                                            }

                                                        </div>
                                                    </div>




                                                </>

                                                : selectedEntryType == 'cash' ?
                                                    <>
                                                        <div className="form-group row student">
                                                            <label className="col-form-label col-md-3 font-weight-bold">Loan Date:</label>
                                                            <div className="col-md-8">

                                                                <input
                                                                    type="text"
                                                                    readOnly

                                                                    defaultValue={formattedDisplayDate}
                                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                                    placeholder="dd-mm-yyyy"
                                                                    className="form-control form-control-sm mb-2"
                                                                    style={{ display: 'inline-block', }}
                                                                />
                                                                <input
                                                                    name='loan_date'
                                                                    type="date"
                                                                    id={`dateInput-nt`}
                                                                    onChange={(e) => handleDateSelection(e)}
                                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                                />
                                                                {
                                                                    loan_date && <p className='text-danger'>{loan_date}</p>
                                                                }

                                                            </div>


                                                        </div>
                                                    </>

                                                    :
                                                    <>

                                                    </>
                                            }


                                            {/* date  */}


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                                <div className='form-group col-md-8'>

                                                    <textarea
                                                        value={assetInfo.note} onChange={brand_input_change}
                                                        name="note"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter note"
                                                        rows={5}
                                                        cols={73}
                                                        // style={{ width: '550px', height: '100px' }}
                                                        maxLength={500}
                                                    ></textarea>
                                                    <small className="text-muted">{assetInfo.note.length} / 500</small>
                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong> Image:</strong></label>
                                                <div class="col-md-8">

                                                    <div>
                                                        <span class="btn btn-success btn-sm " >
                                                            <label for="fileInput" className='mb-0' ><FaUpload></FaUpload><span className='ml-1'>Select Image</span></label>
                                                            <input
                                                                // multiple
                                                                // name="img"
                                                                onChange={brand_combined_change}
                                                                type="file" id="fileInput" style={{ display: "none" }} />
                                                        </span>
                                                    </div>

                                                    {selectedFile[0] &&
                                                        <>
                                                            <img className="w-100 mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[0].path}`} alt="Uploaded File" />

                                                            <input type="hidden" name="img" value={selectedFile[0].path} />
                                                            <button onClick={brand_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                        </>


                                                    }
                                                    {
                                                        file_size_error && (
                                                            <p className='text-danger'>{file_size_error}</p>
                                                        )
                                                    }

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.status} onChange={brand_input_change}
                                                        name='status'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select</option>
                                                        {
                                                            status.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.status_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        error && <p className='text-danger'>{error}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">

                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaonCreates;