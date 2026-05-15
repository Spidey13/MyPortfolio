import { useState, useEffect, useRef } from "react";

function Form({onsubmit}) {
    const [form, setForm] = useState({ vehicleid: "", bodyshopename: "" });
    const [submitting, isSubmitting] = useState(false);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")

    const firsFieldRef = useRef(null);

    useEffect(() => {
        firsFieldRef.current.focus()
    }, []);

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => setSuccess(""), 3000);
        return () => clearTimeout(timer);
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if(errors[name]) setErrors({ ...errors, [name]: "" });

    };

    const validate = () => {
        const errs = {};
        if(!form.vehicleid) errs.vehicleid = "Vehicle ID is required";
        if(!form.bodyshopename) errs.bodyshopename = "Body Shop Name is required";
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if(Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        isSubmitting(true);
        try {
            await onsubmit(form);
            setForm({ vehicleid: "", bodyshopename: "" });
            setErrors({});
            setSuccess("Form submitted successfully");
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            isSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        {success && (<div className="text-success">{success}</div>)}
        <div>
            <label htmlFor="bodyshopename">Body Shop Name</label>
            <input type="text" id="bodyshopename" name="bodyshopename" value={form.bodyshopename} ref={firsFieldRef} onChange={handleChange}/>
            {errors.bodyshopename && <p className="text-editorial-red">{errors.bodyshopename}</p>}
        </div>

        <div>
            <label htmlFor="vehicleid">Vehicle ID</label>
            <input type="text" id="vehicleid" name="vehicleid" value={form.vehicleid} onChange={handleChange}/>
            {errors.vehicleid && <p className="text-editorial-red">{errors.vehicleid}</p>}
        </div>
        {errors.submit && <p className="text-editorial-red">{errors.submit}</p>}
        <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
        </form





}