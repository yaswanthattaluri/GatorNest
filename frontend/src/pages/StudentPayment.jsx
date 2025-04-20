import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "../styles/StudentPayment.css";

const StudentPayment = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/studentlogin");
      return;
    }

    const fetchPendingDues = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/student/pending-dues", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pending dues");
        }

        const data = await response.json();
        setBalance(data.pending_dues);
      } catch (err) {
        console.error("Error fetching pending dues:", err);
        showNotificationMessage("Failed to load balance", "error");
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/payments/student/1", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPaymentHistory(data);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        showNotificationMessage("Failed to fetch payment history", "error");
      }
    };

    fetchPendingDues();
    fetchPaymentHistory();
  }, [navigate]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += limited[i];
    }
    return formatted;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    if (limited.length > 2) {
      return limited.slice(0, 2) + '/' + limited.slice(2);
    }
    return limited;
  };

  const formatCVV = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 4);
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = formatCVV(value);
    }

    setPaymentForm({
      ...paymentForm,
      [name]: formattedValue
    });
  };

  const togglePaymentForm = () => {
    setIsPaying(!isPaying);
    setPaymentForm({
      ...paymentForm,
      amount: balance
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!paymentForm.cardName || !paymentForm.cardNumber || 
        !paymentForm.expiryDate || !paymentForm.cvv) {
      showNotificationMessage("Please fill in all payment details", "error");
      setLoading(false);
      return;
    }

    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
      showNotificationMessage("Please enter a valid card number", "error");
      setLoading(false);
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      showNotificationMessage("Please enter a valid expiry date (MM/YY)", "error");
      setLoading(false);
      return;
    }

    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      showNotificationMessage("Please enter a valid CVV code", "error");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentForm.amount
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      showNotificationMessage(`Payment of $${paymentForm.amount.toFixed(2)} successful!`, "success");

      const newPayment = {
        id: paymentHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(paymentForm.amount),
        status: "Completed"
      };
      setPaymentHistory([newPayment, ...paymentHistory]);

      setPaymentForm({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        amount: 0
      });

      setIsPaying(false);

      // Re-fetch updated balance
      const res = await fetch("http://localhost:8080/api/student/pending-dues", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setBalance(data.pending_dues);
    } catch (err) {
      console.error("Payment error:", err);
      showNotificationMessage("Payment failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <div className="student-payment-container">
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <p>{notificationMessage}</p>
          <button onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}

      <h1 className="page-title">Student Payments</h1>

      {balance === null ? (
        <p>Loading balance...</p>
      ) : (
        <Card>
          <div className="balance-section">
            <h2>Current Balance</h2>
            <h3 className="balance-amount">${balance.toFixed(2)}</h3>
            <button 
              className="pay-now-button" 
              onClick={togglePaymentForm}
              disabled={balance <= 0}
            >
              {balance <= 0 ? 'No Balance Due' : 'Pay Now'}
            </button>
          </div>
        </Card>
      )}

      {isPaying && (
        <Card>
          <div className="payment-form-section">
            <h2>Make a Payment</h2>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label htmlFor="amount">Payment Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  max={balance}
                  value={paymentForm.amount}
                  onChange={handlePaymentFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={paymentForm.cardName}
                  onChange={handlePaymentFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentFormChange}
                  maxLength={19}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentForm.expiryDate}
                    onChange={handlePaymentFormChange}
                    maxLength={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="XXX"
                    value={paymentForm.cvv}
                    onChange={handlePaymentFormChange}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={togglePaymentForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Processing...' : `Pay $${paymentForm.amount}`}
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}

      <Card>
        <div className="payment-history-section">
          <h2>Payment History</h2>
          <div className="table-container">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td className={`status-${payment.status.toLowerCase()}`}>{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentPayment;
