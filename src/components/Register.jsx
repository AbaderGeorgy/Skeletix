import React, { useState } from "react";
import "../styles/register.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [localError, setLocalError] = useState("");

  const requirements = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password)
  };

  const allRequirementsValid = Object.values(requirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!form.terms) {
      setLocalError("You must accept the Terms & Conditions.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    if (!allRequirementsValid) {
      setLocalError("Please complete all password requirements.");
      return;
    }

    const birthYear = new Date().getFullYear() - parseInt(form.age, 10);
    const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

    const registerData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      gender: form.gender,
      dateOfBirth,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      await register(registerData);
      navigate("/home", { replace: true });
    } catch (err) {
      setLocalError(err.message || "Registration failed. Please try again.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="page register-page-bg active">
      <div className="page-container">

        <div className="image-area" id="image_1">
          <div className="separator"></div>
          <img
            src="https://i.postimg.cc/tRr5NF5d/449c4d422794988e6eb217164596f131.jpg"
            alt="Medical Illustration"
          />
        </div>

        <div className="page-content">
          <div className="form-container">
            <div className="form-header">
              <img
                src="https://i.postimg.cc/dVxJWzgh/11111.png"
                alt="MedLab Logo"
                className="logo_2"
              />
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Join Skeleti-X today</p>
            </div>

            {displayError && (
              <div className="form-error" role="alert" style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter first name"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group half">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter last name"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                    value={form.age}
                    onChange={(e) =>
                      setForm({ ...form, age: e.target.value })
                    }
                  />
                </div>

                <div className="form-group half">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    required
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="not_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Create a password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    👁
                  </button>
                </div>

                <div className="password-requirements">
                  <p className="requirement-text">Password must include:</p>
                  <ul className="requirements-list">
                    <li className={`requirement-item ${requirements.length ? "valid" : ""}`}>
                      At least 8 characters
                    </li>
                    <li className={`requirement-item ${requirements.uppercase ? "valid" : ""}`}>
                      One uppercase letter
                    </li>
                    <li className={`requirement-item ${requirements.lowercase ? "valid" : ""}`}>
                      One lowercase letter
                    </li>
                    <li className={`requirement-item ${requirements.number ? "valid" : ""}`}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="password-container">
                  <input
                    type={confirmVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm your password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setConfirmVisible(!confirmVisible)}
                  >
                    👁
                  </button>
                </div>

                {form.confirmPassword.length > 0 && (
                  <div
                    className={
                      form.password === form.confirmPassword
                        ? "password-match valid"
                        : "password-match invalid"
                    }
                  >
                    {form.password === form.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </div>
                )}
              </div>

              <div className="terms-container">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) =>
                      setForm({ ...form, terms: e.target.checked })
                    }
                  />
                  <span className="checkbox-label">
                    I agree to the{" "}
                    <button type="button" className="terms-link" style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="terms-link" style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/" className="form-link">
            Sign In
          </Link>
        </p>
                    </form>
          </div>
        </div>

      </div>
    </div>
  );
}
