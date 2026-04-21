import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight, Home, MapPin, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Step4Address = ({ onNext, onPrev, data, updateData }) => {
    const [loading, setLoading] = useState(false);
    const [sameAsCurrent, setSameAsCurrent] = useState(false);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const res = await api.get('/address/districts');
                if (res.data.success) {
                    setDistricts(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch districts:", error);
                toast.error("Could not load districts list");
            }
        };
        fetchDistricts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...data,
                DistrictId: parseInt(data.DistrictId) || 1,
                permanentDistrictId: parseInt(data.permanentDistrictId) || 1
            };

            const res = await api.post('/address/add', payload);
            if (res.data.success) {
                toast.success('Address details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address details');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setSameAsCurrent(checked);
        if (checked) {
            updateData({
                permanentAddress: data.Address || '',
                permanentCity: data.City || '',
                permanentTaluk: data.Taluk || '',
                permanentDistrictId: data.DistrictId || '',
                permanentPincode: data.Pincode || ''
            });
        }
    };

    const handleChange = (e) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in flex flex-col">
            {/* Current Address */}
            <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Current Address</h2>
                        <p className="text-xs text-slate-500">Present residential details</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Street Address <span className="text-red-500">*</span></label>
                        <textarea required name="Address" rows="3" className="input-premium py-3 h-auto min-h-[80px]" value={data.Address || ''} onChange={handleChange} placeholder="House No, Building Name, Street, Area..." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">City / Village <span className="text-red-500">*</span></label>
                        <input required type="text" name="City" className="input-premium h-11" value={data.City || ''} onChange={handleChange} placeholder="e.g. Bangalore" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Taluk <span className="text-red-500">*</span></label>
                        <input required type="text" name="Taluk" className="input-premium h-11" value={data.Taluk || ''} onChange={handleChange} placeholder="e.g. Bangalore South" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">District <span className="text-red-500">*</span></label>
                        <select required name="DistrictId" className="input-premium h-11" value={data.DistrictId || ''} onChange={handleChange}>
                            <option value="" disabled>Select District...</option>
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Pincode <span className="text-red-500">*</span></label>
                        <input required type="text" pattern="[0-9]{6}" name="Pincode" className="input-premium h-11" value={data.Pincode || ''} onChange={handleChange} placeholder="560001" />
                    </div>
                </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-5 pt-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                            <Home size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Permanent Address</h2>
                            <p className="text-xs text-slate-500">Permanent home address</p>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <input
                            type="checkbox"
                            checked={sameAsCurrent}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Same as Current Address</span>
                    </label>
                </div>

                {!sameAsCurrent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                        <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Street Address <span className="text-red-500">*</span></label>
                            <textarea required name="permanentAddress" rows="3" className="input-premium py-3 h-auto min-h-[80px]" value={data.permanentAddress || ''} onChange={handleChange} placeholder="House No, Building Name, Street, Area..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">City / Village <span className="text-red-500">*</span></label>
                            <input required type="text" name="permanentCity" className="input-premium h-11" value={data.permanentCity || ''} onChange={handleChange} placeholder="e.g. Bangalore" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Taluk <span className="text-red-500">*</span></label>
                            <input required type="text" name="permanentTaluk" className="input-premium h-11" value={data.permanentTaluk || ''} onChange={handleChange} placeholder="e.g. Bangalore South" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">District <span className="text-red-500">*</span></label>
                            <select required name="permanentDistrictId" className="input-premium h-11" value={data.permanentDistrictId || ''} onChange={handleChange}>
                                <option value="" disabled>Select District...</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Pincode <span className="text-red-500">*</span></label>
                            <input required type="text" pattern="[0-9]{6}" name="permanentPincode" className="input-premium h-11" value={data.permanentPincode || ''} onChange={handleChange} placeholder="560001" />
                        </div>
                    </div>
                )}

                {sameAsCurrent && (
                    <div className="bg-primary-50 rounded-lg p-6 text-center border border-primary-100 flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white text-primary-600 flex items-center justify-center border border-primary-100">
                            <Home size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Same as Current Address</p>
                            <p className="text-xs text-slate-500">Permanent address will be automatically synced.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
                <button type="button" onClick={onPrev} className="btn-secondary h-10 px-5 flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary h-10 px-6 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Save & Continue <ChevronRight size={16} /></>
                    )}
                </button>
            </div>
        </form>
    );
};

export default Step4Address;
