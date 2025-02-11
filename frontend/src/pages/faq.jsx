import { useState } from "react";
import "./faq.css"; 

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "How do I register for a hostel?", answer: "Click on the Registration page and fill out the form." },
    { question: "Can I change my dorm preference later?", answer: "Yes, you can update your preference by contacting administration." },
    { question: "Is there a fee for registration?", answer: "Yes, a non-refundable application fee is required." },
    { question: "What amenities are included in the hostel?", answer: "Wi-Fi, laundry, dining services, and study rooms." },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`faq-item ${openIndex === index ? "active" : ""}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">{faq.question}</div>
          <div className="faq-answer">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
