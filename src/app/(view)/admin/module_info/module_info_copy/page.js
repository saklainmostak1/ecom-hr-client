'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import { getAllAdminData } from '@/api/adminPage';
import '../../../admin_layout/modal/fa.css'
import IconModal from '../../../admin_layout/modal/iconModal/page';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const AdminPageCopyAll = ({ Id }) => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        module_info_list();
    }, []);

    const module_info_list = () => {
        getAllAdminData().then(data => {
            setUsers(data)
            setLoading(false)
        })
    };


    const selectAllData = [];
    const parentUser = users?.filter(user => user?.id === +Id);
    selectAllData.push(...parentUser);

    const pageGroupSame = users?.filter(user => user?.page_group === parentUser[0]?.page_group);


    let maxMethodSort = pageGroupSame[0]?.method_sort

    for (let index = 0; index < pageGroupSame.length; index++) {
        const element = pageGroupSame[index].method_sort;
        if (element > maxMethodSort) {
            maxMethodSort = element
        }
    }

    const methodSortValue = (+maxMethodSort) + 1


    const menuType = [
        [
            { mt: 'Non Menu' },
            { mt: 'Menu' },
            { mt: 'Setup' }
        ],
        [
            { mt: 'Menu' },
            { mt: 'Non Menu' },
            { mt: 'Setup' }
        ],
        [
            { mt: 'Setup' },
            { mt: 'Menu' },
            { mt: 'Non Menu' }
        ]
    ]

    const DefaultPage = [
        [
            { dp: 'Non Default' },
            { dp: 'Default' }
        ],
        [
            { dp: 'Default' },
            { dp: 'Non Default' }
        ]

    ]

    const sortArr = [];
    for (let index = 1; index <= 300; index++) {
        sortArr.push(index)
    }

    const module_info_copy = (event) => {
        event.preventDefault();
        const form = event.target;

        for (let index = 0; index < selectAllData.length; index++) {
            const display_name = form.display_name.value || form?.display_name[index]?.value
            const controller_name = form.controller_name.value || form?.controller_name[index]?.value
            const method_name = form.method_name.value || form?.method_name[index]?.value
            const parent_id = form.parent_id?.value || form?.parent_id[index]?.value
            const menu_type = form?.menu_type?.value || form?.menu_type[index]?.value
            const icon = form?.icon?.value || form?.icon[index]?.value
            const btn = form?.btn?.value || form?.btn[index]?.value
            const default_page = form?.default_page?.value || form?.default_page[index]?.value
            const page_group = form?.page_group?.value || form?.page_group[index]?.value
            const controller_bg = form?.controller_bg?.value || form?.controller_bg[index]?.value
            const page_group_icon = form?.page_group_icon?.value || form?.page_group_icon[index]?.value
            const controller_sort = form?.controller_sort?.value || form?.controller_sort[index]?.value
            const page_group_sort = form?.page_group_sort?.value || form?.page_group_sort[index]?.value
            const method_sort = form?.method_sort?.value || form?.method_sort[index]?.value
            const controller_color = form?.controller_color?.value || form?.controller_color[index]?.value
            const status = index
            const controller_code = index

            const EditValue = {
                display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, controller_bg, page_group_icon, controller_sort, page_group_sort, method_sort, controller_color, status, controller_code
            }
            console.log(EditValue);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/copy`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(EditValue)
            })
                .then((Response) => {
                    Response.json()
                    console.log(Response)
                    if (Response.ok === true) {
                        // sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/module_info/module_info_all')
                    }
                }
                )
                .then(data => {

                    router.push('/Admin/module_info/module_info_all');

                })

        }
    }


    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>

                        {
                            loading ? <>
                                <div>
                                    <p>Loading....</p>
                                </div>
                            </> : <>
                         
                                    <div className="text-light rounded mb-4" aria-current="true" style={{ background: '#4267b2' }}>
                                        <div className='d-flex justify-content-between py-1 px-2'>
                                            <h5 className=' pt-2'> Module Info Copy
                                            </h5>
                                            <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1 rounded'><Link href='/Admin/module_info/module_info_all'>Back To Module Info List</Link></button>
                                        </div>
                                    </div>
                           
                                <form onSubmit={module_info_copy}>
                                    {
                                        selectAllData.map((data, index) => (
                                            <div key={data.id}>
                                                <div >
                                                    <div className="row col-md-12 border-bottom pb-3  mx-1">
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-6">Display Name:</label>
                                                                <div className="col-md-6">
                                                                    <input type="text" required="" name="display_name" className="form-control form-control-sm required" id="display_name" placeholder="Enter Display Name" defaultValue={data.display_name} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Name:</label>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        id="controller_name"
                                                                        className="form-control form-control-sm required controller_name"
                                                                        name="controller_name"
                                                                        defaultValue={data.controller_name}
                                                                    />

                                                                </div>
                                                                <label className="col-form-label col-md-6">Method Name:</label>
                                                                <div className="col-md-6">
                                                                    <input type="text" name="method_name" className="form-control form-control-sm " id="method_name" placeholder="Enter Method Name" defaultValue={data.method_name} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Parent Id:</label>
                                                                <div className="col-md-6">
                                                                    <input type="number" step="1" name="parent_id" className="form-control form-control-sm " id="parent_id" placeholder="Enter Parent Id" defaultValue={data.parent_id} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Menu Type:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="menu_type" className="form-control form-control-sm  trim" id="menu_type">
                                                                        {
                                                                            (data?.menu_type === 0) ? <>
                                                                                {menuType[0].map((md, index) =>
                                                                                    <option key={index} defaultValue={index}>{md.mt}</option>
                                                                                )}
                                                                            </> :
                                                                                (data?.menu_type === 1) ? <>
                                                                                    {menuType[1].map((md, index) =>
                                                                                        <option key={index} defaultValue={index}>{md.mt}</option>
                                                                                    )}
                                                                                </> :
                                                                                    <>
                                                                                        {menuType[2].map((md, index) =>
                                                                                            <option key={index} defaultValue={index}>{md.mt}</option>
                                                                                        )}
                                                                                    </>
                                                                        }

                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-5">Icon:</label>
                                                                <div className="col-md-7">
                                                                    <div className="input-group d-flex">
                                                                        <div className="input-group-append">
                                                                            <IconModal
                                                                                names="icon"
                                                                                index={index}
                                                                                Icon={data.icon}
                                                                            ></IconModal>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <label className="col-form-label col-md-5">Btn:</label>
                                                                <div className="col-md-7">
                                                                    <input type="text" name="btn" className="form-control form-control-sm " id="btn" placeholder="Enter Btn" defaultValue={data.btn} />
                                                                </div>
                                                                <label className="col-form-label col-md-5">Default Page:</label>
                                                                <div className="col-md-7">
                                                                    <select name="default_page" className="form-control form-control-sm trim" id="default_page">
                                                                        {
                                                                            ((data?.default_page === 0)) ? <>
                                                                                {DefaultPage[0].map((dd, index) =>
                                                                                    <option key={index} defaultValue={index}>{dd.dp}</option>
                                                                                )}
                                                                            </> : <>
                                                                                {DefaultPage[1].map((dd, index) =>
                                                                                    <option key={index} defaultValue={index}>{dd.dp}</option>
                                                                                )}
                                                                            </>
                                                                        }

                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-5">Page Group:</label>
                                                                <div className="col-md-7">
                                                                    <input
                                                                        type="text"
                                                                        id="page_group"
                                                                        className="form-control form-control-sm page_group"
                                                                        name="page_group"
                                                                        defaultValue={data.page_group}
                                                                    />
                                                                </div>
                                                                <label className="col-form-label col-md-5">Controller Background:</label>
                                                                <div className="col-md-7">
                                                                    <div className=' d-flex'>
                                                                        <input
                                                                            type="color"
                                                                            name="controller_bg"
                                                                            className="form-control form-control-sm "
                                                                            placeholder="Enter Controller bg"
                                                                            defaultValue={data.controller_bg}
                                                                        />
                                                                        <div className="sp-replacer sp-light"><div className="sp-preview"><div className="sp-preview-inner"></div></div><div className="sp-dd mt-1">▼</div></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-6">Page Group Icon:</label>
                                                                <div className="col-md-6">
                                                                    <div className="input-group d-flex">
                                                                        <div className="input-group-append">
                                                                            <IconModal
                                                                                names="page_group_icon"
                                                                                index={index}
                                                                                pageGroupIcons={data.page_group_icon}
                                                                            ></IconModal>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="controller_sort" className="form-control form-control-sm controller_sort trim" id="controller_sort" defaultValue={data.controller_sort}>

                                                                        {
                                                                            sortArr.map((d, ind) => <option key={ind} value={d}>{d}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Page Group Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select
                                                                        required=""
                                                                        name="page_group_sort"
                                                                        className="form-control form-control-sm page_group_sort trim"
                                                                        id="page_group_sort"
                                                                        defaultValue={data.page_group_sort}
                                                                    >
                                                                        {sortArr.map((d, ind) => (
                                                                            <option key={ind} value={d}>
                                                                                {d}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                </div>
                                                                <label className="col-form-label col-md-6">Method Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="method_sort" className="form-control form-control-sm method_sort trim" id="method_sort"
                                                                        // defaultValue={data?.method_sort}
                                                                        defaultValue={methodSortValue}
                                                                    >
                                                                        {
                                                                            sortArr.map((d, ind) => <option key={ind} value={ind}>{ind}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Color:</label>
                                                                <div className="col-md-6">
                                                                    <div className=' d-flex'>
                                                                        <input
                                                                            type="color"
                                                                            name="controller_color"
                                                                            className="form-control form-control-sm "
                                                                            placeholder="Enter controller color"
                                                                            defaultValue={data.controller_color}
                                                                        />
                                                                        <div className="sp-replacer sp-light"><div className="sp-preview"><div className="sp-preview-inner"></div></div><div className="sp-dd mt-1">▼</div></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    {
                                        loading && <div className='text-center'>
                                            <div colSpan='100%' className='my-5 py-5 border-bottom-0 '>
                                                <div className=' my-5 py-5 text-primary'>
                                                    <FontAwesomeIcon style={{
                                                        height: '40px',
                                                        width: '40px',
                                                    }} icon={faSpinner} spin />
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        loading || <div className="offset-md-3 col-sm-6 my-3 pb-5">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    }

                                </form>
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageCopyAll;







