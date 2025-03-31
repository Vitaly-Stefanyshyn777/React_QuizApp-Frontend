import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

export default function RegistrationForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const phoneInputRef = useRef(null);
  const iti = useRef(null);

  useEffect(() => {
    if (phoneInputRef.current && !iti.current) {
      iti.current = intlTelInput(phoneInputRef.current, {
        initialCountry: "ua",
        separateDialCode: true,
        nationalMode: true,
        preferredCountries: ["ua", "us", "gb"],
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, including a letter and a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhone = iti.current?.getNumber() || "";

    onSubmit({
      ...formData,
      phone: fullPhone,
    });
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-800 rounded-lg p-6 md:p-10 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">
          Registration
        </h2>

        <div>
          <label className="block mb-2 text-white">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-2 text-white">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-white">Phone Number</label>
          <input
            ref={phoneInputRef}
            type="tel"
            className="w-full p-3 rounded bg-gray-700 text-white"
            placeholder="99 123 4567"
          />
        </div>

        <div>
          <label className="block mb-2 text-white">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-3 rounded bg-gray-700 text-white"
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white w-full sm:w-1/2"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white w-full sm:w-1/2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

RegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
