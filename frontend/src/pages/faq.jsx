
function FAQ() {
  const faqs = [
    { question: "How do I register for a hostel?", answer: "Click on the Registration page and fill out the form." },
    { question: "Can I change my dorm preference later?", answer: "Yes, you can update your preference by contacting administration." },
    { question: "Is there a fee for registration?", answer: "Yes, a non-refundable application fee is required." },
    { question: "What amenities are included in the hostel?", answer: "Wi-Fi, laundry, dining services, and study rooms." },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Frequently Asked Questions</h2>
      <ul>
        {faqs.map((faq, index) => (
          <li key={index} style={{ marginBottom: "15px" }}>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;
