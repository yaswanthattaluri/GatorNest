import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "../styles/StudentPayment.css";

const StudentPayment = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(1250.00);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: "2023-10-15", amount: 1250.00, status: "Completed" },
    { id: 2, date: "2023-09-15", amount: 1250.00, status: "Completed" }
  ]);
  
  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: balance
  });

  // Check if student is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/studentlogin");
    }
  }, [navigate]);

  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Format with spaces
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += limited[i];
    }
    return formatted;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits
    const limited = cleaned.slice(0, 4);
    // Format with slash
    if (limited.length > 2) {
      return limited.slice(0, 2) + '/' + limited.slice(2);
    }
    return limited;
  };

  // Format CVV (limit to 3 or 4 digits)
  const formatCVV = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits (some cards have 4-digit CVV)
    return cleaned.slice(0, 4);
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    
    // Apply formatting based on field type
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
    // Pre-fill the balance amount in the payment form
    setPaymentForm({
      ...paymentForm,
      amount: balance
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!paymentForm.cardName || !paymentForm.cardNumber || 
        !paymentForm.expiryDate || !paymentForm.cvv) {
      showNotificationMessage("Please fill in all payment details", "error");
      setLoading(false);
      return;
    }

    // Validate card number (should be 16 digits + spaces)
    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
      showNotificationMessage("Please enter a valid card number", "error");
      setLoading(false);
      return;
    }

    // Validate expiry date (should be MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      showNotificationMessage("Please enter a valid expiry date (MM/YY)", "error");
      setLoading(false);
      return;
    }

    // Validate CVV (should be 3 or 4 digits)
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      showNotificationMessage("Please enter a valid CVV code", "error");
      setLoading(false);
      return;
    }

    // For a simple demo, we'll simulate a successful payment
    setTimeout(() => {
      // Payment successful
      setBalance(0);
      showNotificationMessage(`Payment of $${paymentForm.amount.toFixed(2)} successful!`, "success");
      
      // Add to payment history
      const newPayment = {
        id: paymentHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(paymentForm.amount),
        status: "Completed"
      };
      setPaymentHistory([newPayment, ...paymentHistory]);
      
      // Reset form and view
      setPaymentForm({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        amount: 0
      });
      setIsPaying(false);
      setLoading(false);
    }, 1500); // Add a slight delay to simulate processing
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <div className="student-payment-container">
      {/* Notification popup */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <p>{notificationMessage}</p>
          <button onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}

      <h1 className="page-title">Student Payments</h1>
      
      {/* Balance Card */}
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

      {/* Payment Form */}
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
                  maxLength={19} // 16 digits + 3 spaces
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
                    maxLength={5} // MM/YY format
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
                    maxLength={4} // Some cards have 4-digit CVV
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

      {/* Payment History */}
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