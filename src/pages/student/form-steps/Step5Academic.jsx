import React, { useState } from 'react';
import api from '../../../api/axios';
import { Loader2, ChevronLeft, ChevronRight, School, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Step5Academic = ({ onNext, onPrev, data, updateData }) => {
    const [loading, setLoading] = useState(false);

    const calculateSSLC = (updatedData = data) => {
        const obtained = parseFloat(updatedData.sslcMarksObtained) || 0;
        const max = parseFloat(updatedData.sslcMaxMarks) || 0;
        if (max > 0) {
            const perc = (obtained / max) * 100;
            updateData({ sslcPercentage: perc.toFixed(2) });
        }
    };

    const calculatePUC = (updatedData = data) => {
        const phys = parseFloat(updatedData.physicsMarks) || 0;
        const math = parseFloat(updatedData.mathsMarks) || 0;
        const opt = parseFloat(updatedData.optionalMarks) || 0;
        const max = 300;

        const agg = phys + math + opt;
        const perc = (agg / max) * 100;
        updateData({
            pucAggregate: agg,
            pucPercentage: perc.toFixed(2),
            pucMaxMarks: max
        });
    };

    const calculateDiploma = (updatedData = data) => {
        const obtained = parseFloat(updatedData.diplomaFinalYearObtained) || 0;
        const max = parseFloat(updatedData.diplomaFinalYearMaxMarks) || 0;
        if (max > 0) {
            const perc = (obtained / max) * 100;
            updateData({ diplomaPercentage: perc.toFixed(2) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                sslcBoard: data.sslcBoard,
                sslcYear: parseInt(data.sslcYear),
                sslcRegisterNumber: data.sslcRegisterNumber,
                sslcMarksObtained: parseFloat(data.sslcMarksObtained),
                sslcMaxMarks: parseFloat(data.sslcMaxMarks),
                sslcPercentage: parseFloat(data.sslcPercentage),
                sslcAttempts: parseInt(data.sslcAttempts),
                pucBoard: data.pucBoard || undefined,
                pucYear: data.pucYear ? parseInt(data.pucYear) : undefined,
                pucRegisterNumber: data.pucRegisterNumber || undefined,
                physicsMarks: data.physicsMarks ? parseFloat(data.physicsMarks) : undefined,
                mathsMarks: data.mathsMarks ? parseFloat(data.mathsMarks) : undefined,
                optionalSubject: data.optionalSubject || undefined,
                optionalMarks: data.optionalMarks ? parseFloat(data.optionalMarks) : undefined,
                pucMaxMarks: data.pucMaxMarks ? parseFloat(data.pucMaxMarks) : undefined,
                pucAggregate: data.pucAggregate ? parseFloat(data.pucAggregate) : undefined,
                pucPercentage: data.pucPercentage ? parseFloat(data.pucPercentage) : undefined,
                pucAttempts: data.pucAttempts ? parseInt(data.pucAttempts) : undefined,
                diplomaUniversity: data.diplomaUniversity || undefined,
                diplomaYear: data.diplomaYear ? parseInt(data.diplomaYear) : undefined,
                diplomaRegisterNumber: data.diplomaRegisterNumber || undefined,
                diplomaFinalYearMaxMarks: data.diplomaFinalYearMaxMarks ? parseFloat(data.diplomaFinalYearMaxMarks) : undefined,
                diplomaFinalYearObtained: data.diplomaFinalYearObtained ? parseFloat(data.diplomaFinalYearObtained) : undefined,
                diplomaPercentage: data.diplomaPercentage ? parseFloat(data.diplomaPercentage) : undefined,
                diplomaAttempts: data.diplomaAttempts ? parseInt(data.diplomaAttempts) : undefined,
            };

            const res = await api.post('/academic/add', payload);
            if (res.data.success) {
                toast.success('Academic details saved!');
                onNext();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save academic details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };
        updateData(updatedFields);

        const combinedData = { ...data, ...updatedFields };
        if (name === 'sslcMarksObtained' || name === 'sslcMaxMarks') {
            calculateSSLC(combinedData);
        } else if (name === 'diplomaFinalYearObtained' || name === 'diplomaFinalYearMaxMarks') {
            calculateDiploma(combinedData);
        }
    };

    const handlePucChange = (e) => {
        const { name, value } = e.target;
        const updatedFields = { [name]: value };
        updateData(updatedFields);
        calculatePUC({ ...data, ...updatedFields });
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }) => (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5 mt-8 first:mt-0">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <Icon size={18} />
            </div>
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in flex flex-col">
            {/* SSLC Section */}
            <div>
                <SectionHeader icon={School} title="SSLC (10th Standard) Details" subtitle="Secondary education academic records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board <span className="text-red-500">*</span></label>
                        <input required type="text" name="sslcBoard" className="input-premium h-11" value={data.sslcBoard || ''} onChange={handleChange} placeholder="e.g. KSEAB / CBSE" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcYear" className="input-premium h-11" value={data.sslcYear || ''} onChange={handleChange} placeholder="2021" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number <span className="text-red-500">*</span></label>
                        <input required type="text" name="sslcRegisterNumber" className="input-premium h-11 uppercase" value={data.sslcRegisterNumber || ''} onChange={handleChange} placeholder="e.g. 1234567" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Max Marks <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcMaxMarks" className="input-premium h-11" value={data.sslcMaxMarks || ''} onChange={handleChange} placeholder="625" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Marks Obtained <span className="text-red-500">*</span></label>
                        <input required type="number" name="sslcMarksObtained" className="input-premium h-11" value={data.sslcMarksObtained || ''} onChange={handleChange} placeholder="580" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="sslcPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.sslcPercentage || ''} placeholder="0.00" />
                    </div>
                </div>
            </div>

            {/* PUC Details */}
            <div>
                <SectionHeader icon={GraduationCap} title="PUC (12th Standard) Details" subtitle="Optional — Senior secondary records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Board</label>
                        <input type="text" name="pucBoard" className="input-premium h-11 uppercase" value={data.pucBoard || ''} onChange={handleChange} placeholder="PUE BOARD / CBSE" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing</label>
                        <input type="number" name="pucYear" className="input-premium h-11" value={data.pucYear || ''} onChange={handleChange} placeholder="2023" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number</label>
                        <input type="text" name="pucRegisterNumber" className="input-premium h-11 uppercase" value={data.pucRegisterNumber || ''} onChange={handleChange} placeholder="7654321" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Physics Marks</label>
                        <input type="number" name="physicsMarks" className="input-premium h-11" value={data.physicsMarks || ''} onChange={handlePucChange} placeholder="95" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Maths Marks</label>
                        <input type="number" name="mathsMarks" className="input-premium h-11" value={data.mathsMarks || ''} onChange={handlePucChange} placeholder="98" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Optional Marks</label>
                        <input type="number" name="optionalMarks" className="input-premium h-11" value={data.optionalMarks || ''} onChange={handlePucChange} placeholder="96" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="pucPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.pucPercentage || ''} placeholder="0.00" />
                    </div>
                </div>
            </div>

            {/* Diploma Details */}
            <div>
                <SectionHeader icon={BookOpen} title="Diploma Details" subtitle="Optional — Vocational education records" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">University</label>
                        <input type="text" name="diplomaUniversity" className="input-premium h-11 uppercase" value={data.diplomaUniversity || ''} onChange={handleChange} placeholder="e.g. DTE" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Year of Passing</label>
                        <input type="number" name="diplomaYear" className="input-premium h-11" value={data.diplomaYear || ''} onChange={handleChange} placeholder="2023" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Register Number</label>
                        <input type="text" name="diplomaRegisterNumber" className="input-premium h-11 uppercase" value={data.diplomaRegisterNumber || ''} onChange={handleChange} placeholder="D12345" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Final Year Max Marks</label>
                        <input type="number" name="diplomaFinalYearMaxMarks" className="input-premium h-11" value={data.diplomaFinalYearMaxMarks || ''} onChange={handleChange} placeholder="1000" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Final Year Obtained</label>
                        <input type="number" name="diplomaFinalYearObtained" className="input-premium h-11" value={data.diplomaFinalYearObtained || ''} onChange={handleChange} placeholder="850" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Percentage (%)</label>
                        <input readOnly type="number" step="0.01" name="diplomaPercentage" className="input-premium h-11 text-primary-700 font-semibold bg-primary-50 border-primary-100 cursor-not-allowed" value={data.diplomaPercentage || ''} placeholder="0.00" />
                    </div>
                </div>
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

export default Step5Academic;
