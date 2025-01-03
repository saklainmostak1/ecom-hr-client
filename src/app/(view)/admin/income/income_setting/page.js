// 'use client' 
 //ismile
// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';

// const IncomeSettings = () => {


//     const { data: incomes = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['incomes'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_list`)

//             const data = await res.json()
//             return data
//         }
//     })



//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const income = module_settings.filter(moduleI => moduleI.table_name === 'income')
//     const columnListSelected = income[0]?.column_name
//     const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
//     console.log(columnListSelectedArray)

//     const formatString = (str) => {
//         const words = str?.split('_');

//         const formattedWords = words?.map((word) => {
//             const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             return capitalizedWord;
//         });

//         return formattedWords?.join(' ');
//     };

//     const columnNames = incomes && incomes.length > 0 ? Object.keys(incomes[0]) : [];


//     console.log('Column Names:', columnNames);



//     // const { data: moduleInfo = []
//     // } = useQuery({
//     //     queryKey: ['moduleInfo'],
//     //     queryFn: async () => {
//     //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all`)

//     //         const data = await res.json()
//     //         return data
//     //     }
//     // })
//     // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'income'))
//     // const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'income')

//     //   console.log(filteredModuleInfo);





//     const [page_group, setPage_group] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('pageGroup') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('pageGroup');
//             setPage_group(storedUserId);
//         }
//     }, []);


//     const [selectedColumns, setSelectedColumns] = React.useState([]);



//     const columnString = selectedColumns.join(', ');




//     const handleColumnChange = (selectedItems) => {
//         setSelectedColumns(selectedItems.map((item) => item.value));
//         // handleSearch(); 
//     };
//     console.log(selectedColumns)
//     const filteredColumns = columnNames.filter(column => column !== 'id');

//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);

//     // Function to handle checkbox change
//     const handleSubmit = (event) => {


//         event.preventDefault();
//         const form = event.target
//         const name = form.name.value
//         const decimal_digit = form.decimal_digit.value
//         const table_name = form.table_name.value


//         // Add your form submission logic here using the 'fields' state.

//         const addValue = {
//             name,
//             table_name: table_name.toLowerCase(),
//             column_name: columnString,
//             created_by: userId,
//             decimal_digit,
//         }

//         console.log(addValue)

//         // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(addValue),
//         })
//             .then((Response) => Response.json())
//             .then((data) => {

//                 console.log(data);
//                 console.log(addValue);
//             })
//             .catch((error) => console.error(error));

//     }




//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div class="body-content bg-light">

//                             <div class=" border-primary shadow-sm border-0">
//                                 <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">income Settings</h5>
//                                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">

//                                         <Link href={`/Admin/income/income_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create income</Link>
//                                     </div>
//                                 </div>
//                                 <div class="card-body">
//                                     <form onSubmit={handleSubmit}>
//                                         <div class="col-md-9 offset-md-1">
//                                             <div class="form-group row student">
//                                                 <label class="col-form-label col-md-2"><strong>Name:</strong></label>
//                                                 <div class="col-md-4">
//                                                     <input
//                                                         defaultValue={income[0]?.name}
//                                                         name="name"
//                                                         type="text" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Name" />
//                                                 </div>

//                                                 <label class="col-form-label col-md-2"><strong>Table Name:</strong></label>
//                                                 <div class="col-md-4">
//                                                     <input
//                                                         defaultValue={income[0]?.table_name}
//                                                         type="text" name="table_name" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Table Name" />
//                                                 </div>
//                                             </div>
//                                             <div class="form-group row student">

//                                                 <label class="col-form-label col-md-2"><strong>Design:</strong></label>

//                                                 <div className="col-md-4">
//                                                     <Select
//                                                         name='select'
//                                                         labelField='label'
//                                                         valueField='value'
//                                                         options={[
//                                                             { label: 'Serial', value: 'serial' }, // Serial option
//                                                             // Serial option
//                                                             ...filteredColumns.map(column => ({ label: formatString(column), value: column })),
//                                                             { label: 'Action', value: 'action' }
//                                                         ]}
//                                                         values={

//                                                             columnListSelectedArray?.map(column => ({
//                                                                 label: formatString(column),
//                                                                 value: column,
//                                                             }))

//                                                         }
//                                                         multi
//                                                         onChange={handleColumnChange}
//                                                     />
//                                                 </div>

//                                                 <label class="col-form-label col-md-2"><strong>Decimal Digit:</strong></label>

//                                                 <div class="col-md-4">

//                                                     <select
//                                                         required=""
//                                                         name="decimal_digit"
//                                                         className="form-control form-control-sm mb-2">
//                                                         <option value={income[0]?.decimal_digit}>{income[0]?.decimal_digit}</option>
//                                                         {income[0]?.decimal_digit == 2 ? '' : <option value='2'>2</option>}
//                                                         {income[0]?.decimal_digit == 3 ? null : <option value='3'>3</option>}
//                                                     </select>


//                                                 </div>

//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </form>
//                                     <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                                         <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default IncomeSettings;


'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';

const EmployeeSetting = () => {


    const { data: expenses = [], isLoading, refetch
    } = useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_list`)

            const data = await res.json()
            return data
        }
    })



    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    const expense = module_settings.filter(moduleI => moduleI.table_name === 'income')
    // const columnListSelected = expense[0]?.column_name
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelected = expense[0]?.column_name
    const columnListSelectedSearch = expense[0]?.search
    const columnListSelectedsearchAscDesc = expense[0]?.search_value
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelectedSerachArray = columnListSelectedSearch?.split(',').map(item => item.trim());

    const columnListSelectedSerachArrays = columnListSelectedsearchAscDesc?.split(',').map(item => item.trim());
    console.log(columnListSelectedSerachArrays)

    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };

    const columnNames = expenses && expenses.length > 0 ? Object.keys(expenses[0]) : [];


    console.log('Column Names:', columnNames);


    const [selectedColumnsSearch, setSelectedColumnsSerach] = useState([]);
    useEffect(() => {
        setSelectedColumnsSerach(columnListSelectedSerachArray)
    }, [])

    const brand_column_changes = (selectedItems) => {
        setSelectedColumnsSerach(selectedItems.map((item) => item.value));
        // brand_search(); 
    };
    console.log(selectedColumnsSearch)


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

    const [selectedColumns, setSelectedColumns] = React.useState([]);



    const columnString = selectedColumns?.join(', ');

    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])



    const handleColumnChange = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // handleSearch(); 
    };
    console.log(selectedColumns)
    const filteredColumns = columnNames.filter(column => column !== 'id');

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

    // Function to handle checkbox change
    const handleSubmit = (event) => {


        event.preventDefault();
        const form = event.target
        const name = form.name.value
        const table_name = form.table_name.value
        const selectedColumnsSearchs = selectedColumnsSearch.join(', ')
        const columnListSelectedSerachArrays = columnListSelectedSerachArray.join(', ')
        console.log(columnString)
        // Add your form submission logic here using the 'fields' state.

        const addValue = {
            name,
            table_name: table_name.toLowerCase(),
            column_name: columnString,
            created_by: userId,
            selectedColumnsSearchs,
            columnListSelectedSerachArrays

        }

        console.log(addValue)

        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(addValue),
        })
            .then((Response) => Response.json())
            .then((data) => {

                console.log(data);
                console.log(addValue);
            })
            .catch((error) => console.error(error));

    }





    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class="body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Income Settings</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/income/income_create?page_group=${page_group}`} class="btn btn-sm btn-info">Create Income</Link>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div class="col-md-9 offset-md-1">
                                            <div class="form-group row student d-none">
                                                <label class="col-form-label col-md-2"><strong>Name:</strong></label>
                                                <div class="col-md-4">
                                                    <input

                                                        value={expense[0]?.name}
                                                        name="name"
                                                        type="text" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Name" />
                                                </div>

                                                <label class="col-form-label col-md-2"><strong>Table Name:</strong></label>
                                                <div class="col-md-4">
                                                    <input
                                                        value={expense[0]?.table_name}
                                                        type="text" name="table_name" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Table Name" />
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-2"><strong>Design:</strong></label>

                                                <div className="col-md-4">
                                                    <Select
                                                        name='select'
                                                        labelField='label'
                                                        valueField='value'
                                                        options={[
                                                            { label: 'Serial', value: 'serial' }, // Serial option
                                                            // Serial option
                                                            ...filteredColumns.map(column => ({ label: formatString(column), value: column })),
                                                            { label: 'Action', value: 'action' }
                                                        ]}
                                                        values={

                                                            columnListSelectedArray?.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            }))

                                                        }
                                                        multi
                                                        onChange={handleColumnChange}
                                                    />
                                                </div>

                                                <label class="col-form-label col-md-2"><strong>Search Properties:</strong></label>

                                                <div className="col-md-4">


                                                    <Select
                                                        name='select'
                                                        labelField='label'
                                                        valueField='value'
                                                        values={

                                                            columnListSelectedSerachArrays?.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            }))}
                                                        options={
                                                            columnListSelectedSerachArray?.map(column => {
                                                                let label = formatString(column);
                                                                let value = column;
                                                                if (column.startsWith("income_category_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Income Category (asc)";
                                                                        value = "income_category_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Income Category (desc)";
                                                                        value = "income_category_id_(DESC)";
                                                                    }
                                                                }
                                                                return {
                                                                    label: label,
                                                                    value: value,
                                                                };
                                                            })
                                                        }
                                                        // values={

                                                        //     columnListSelectedSerachArray?.map(column => ({
                                                        //         label: formatString(column),
                                                        //         value: column,
                                                        //     }))

                                                        // }
                                                        onChange={brand_column_changes}

                                                        multi

                                                    />






                                                </div>

                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                    <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSetting;