import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/education.css';
import Header from "../components/Header";


function generateArticleContent(categoryKey, title, description) {
  const templates = {
    'xray': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>Key Learning Points</h3>
        <ul>
          <li>Understand basic X-ray principles and safety</li>
          <li>Learn to identify normal vs. abnormal findings</li>
          <li>Recognize common medical conditions visible on X-rays</li>
          <li>Understand the limitations of X-ray imaging</li>
          <li>Learn when additional imaging might be needed</li>
        </ul>
        
        <h3>Detailed Explanation</h3>
        <p>X-ray imaging, also known as radiography, is a medical imaging technique that uses electromagnetic radiation to create images of the internal structures of the body. Different tissues absorb X-rays at different rates:</p>
        
        <div class="article-table">
          <table>
            <thead>
              <tr>
                <th>Tissue Type</th>
                <th>Appearance on X-ray</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bone</td>
                <td>White (radiopaque)</td>
                <td>Fractures, arthritis</td>
              </tr>
              <tr>
                <td>Fat & Muscle</td>
                <td>Gray</td>
                <td>Soft tissue masses</td>
              </tr>
              <tr>
                <td>Air</td>
                <td>Black (radiolucent)</td>
                <td>Lungs, intestines</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="article-tip">
          <strong>Medical Tip:</strong> Always discuss your X-ray results with a qualified healthcare professional. While educational resources can help you understand the basics, only trained medical professionals can provide accurate diagnoses.
        </div>
      </div>
    `,

    'mri': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>What is MRI?</h3>
        <p>Magnetic Resonance Imaging (MRI) is a non-invasive medical imaging technique that uses strong magnetic fields and radio waves to generate detailed images of organs and tissues within the body. Unlike X-rays and CT scans, MRI does not use ionizing radiation.</p>
        
        <h3>Preparation Guidelines</h3>
        <ul>
          <li><strong>Before the scan:</strong> Remove all metal objects, inform staff about implants or medical devices</li>
          <li><strong>During the scan:</strong> Remain still, expect loud knocking sounds, communicate via intercom if needed</li>
          <li><strong>After the scan:</strong> No special recovery needed, results reviewed by radiologist</li>
        </ul>
        
        <h3>Common Uses</h3>
        <div class="article-grid">
          <div class="article-grid-item">
            <h4>Neurological</h4>
            <p>Brain tumors, stroke, multiple sclerosis, dementia evaluation</p>
          </div>
          <div class="article-grid-item">
            <h4>Musculoskeletal</h4>
            <p>Joint injuries, spinal disorders, sports injuries, tendon tears</p>
          </div>
          <div class="article-grid-item">
            <h4>Cardiovascular</h4>
            <p>Heart structure, blood vessels, cardiac function assessment</p>
          </div>
        </div>
        
        <div class="article-warning">
          <strong>Important Safety Note:</strong> Certain metal implants, pacemakers, and medical devices may not be compatible with MRI. Always inform your healthcare provider about any implants or medical conditions before scheduling an MRI.
        </div>
      </div>
    `,

    'lab': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>Understanding Blood Test Results</h3>
        <p>Blood tests provide crucial information about your health by measuring various substances in your blood. Here are common components and their significance:</p>
        
        <div class="article-table">
          <table>
            <thead>
              <tr>
                <th>Test Component</th>
                <th>Normal Range</th>
                <th>What It Indicates</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Complete Blood Count (CBC)</td>
                <td>Varies</td>
                <td>Overall health, anemia, infection</td>
              </tr>
              <tr>
                <td>Hemoglobin (Hb)</td>
                <td>13.5-17.5 g/dL (M)<br>12.0-15.5 g/dL (F)</td>
                <td>Oxygen carrying capacity</td>
              </tr>
              <tr>
                <td>Blood Glucose (Fasting)</td>
                <td>70-100 mg/dL</td>
                <td>Diabetes screening</td>
              </tr>
              <tr>
                <td>Cholesterol Total</td>
                <td>&lt;200 mg/dL</td>
                <td>Heart disease risk</td>
              </tr>
              <tr>
                <td>Liver Enzymes (ALT)</td>
                <td>7-56 U/L</td>
                <td>Liver function</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3>Factors Affecting Results</h3>
        <ul>
          <li><strong>Time of day:</strong> Some tests require fasting</li>
          <li><strong>Medications:</strong> Can alter test results</li>
          <li><strong>Hydration:</strong> Affects concentration measurements</li>
          <li><strong>Recent meals:</strong> Can impact glucose and lipid levels</li>
          <li><strong>Stress & exercise:</strong> Temporary effects on some markers</li>
        </ul>
        
        <div class="article-note">
          <strong>Medical Disclaimer:</strong> Normal ranges may vary between laboratories. These values are for educational purposes only. Always consult with your healthcare provider for interpretation of your specific test results.
        </div>
      </div>
    `,

    'ct': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>What is CT Scan?</h3>
        <p>Computed Tomography (CT) scan is a medical imaging procedure that uses X-rays and computer technology to create detailed cross-sectional images of the body. CT scans provide more detailed information than standard X-rays.</p>
        
        <h3>How CT Scans Work</h3>
        <p>During a CT scan, an X-ray beam rotates around your body, and multiple images are taken from different angles. A computer then combines these images to create detailed cross-sectional views of your internal organs and structures.</p>
        
        <h3>Common Applications</h3>
        <ul>
          <li><strong>Diagnosis:</strong> Detecting tumors, infections, fractures, and internal bleeding</li>
          <li><strong>Treatment Planning:</strong> Guiding surgical procedures and radiation therapy</li>
          <li><strong>Monitoring:</strong> Tracking the effectiveness of treatments</li>
          <li><strong>Emergency Medicine:</strong> Quickly assessing trauma and injuries</li>
        </ul>
        
        <div class="article-tip">
          <strong>Important:</strong> CT scans use ionizing radiation, so they should only be performed when medically necessary. Always discuss the risks and benefits with your healthcare provider.
        </div>
      </div>
    `,

    'ai': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>How AI Transforms Medical Imaging</h3>
        <p>Artificial Intelligence (AI) in medical imaging uses machine learning algorithms to analyze medical images, helping healthcare professionals make faster and more accurate diagnoses.</p>
        
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Speed:</strong> AI can analyze images in seconds, reducing wait times</li>
          <li><strong>Accuracy:</strong> Pattern recognition helps identify subtle abnormalities</li>
          <li><strong>Consistency:</strong> AI provides consistent analysis, reducing human error</li>
          <li><strong>Early Detection:</strong> Can identify early signs of diseases before symptoms appear</li>
        </ul>
        
        <h3>AI Applications in Medical Imaging</h3>
        <div class="article-grid">
          <div class="article-grid-item">
            <h4>Image Analysis</h4>
            <p>Automated detection of abnormalities in X-rays, MRIs, and CT scans</p>
          </div>
          <div class="article-grid-item">
            <h4>Pattern Recognition</h4>
            <p>Identifying patterns that may indicate disease or conditions</p>
          </div>
          <div class="article-grid-item">
            <h4>Predictive Analytics</h4>
            <p>Assessing risk factors and predicting potential health issues</p>
          </div>
        </div>
        
        <div class="article-note">
          <strong>Note:</strong> AI is a tool to assist healthcare professionals, not replace them. All AI-generated results should be reviewed and confirmed by qualified medical professionals.
        </div>
      </div>
    `,

    'security': `
      <div class="article-content">
        <h3>Introduction</h3>
        <p>${description}</p>
        
        <h3>Protecting Your Medical Data</h3>
        <p>Medical data security is crucial for protecting patient privacy and ensuring compliance with healthcare regulations like HIPAA (Health Insurance Portability and Accountability Act).</p>
        
        <h3>Security Measures</h3>
        <ul>
          <li><strong>Encryption:</strong> All data is encrypted both in transit and at rest</li>
          <li><strong>Access Controls:</strong> Strict authentication and authorization protocols</li>
          <li><strong>Audit Logs:</strong> Comprehensive tracking of all data access and modifications</li>
          <li><strong>Regular Updates:</strong> Security systems are continuously updated to protect against threats</li>
        </ul>
        
        <h3>HIPAA Compliance</h3>
        <p>HIPAA requires healthcare organizations to implement safeguards to protect patient health information. This includes:</p>
        <ul>
          <li>Administrative safeguards (policies and procedures)</li>
          <li>Physical safeguards (facility access controls)</li>
          <li>Technical safeguards (encryption, access controls)</li>
        </ul>
        
        <div class="article-warning">
          <strong>Your Rights:</strong> You have the right to access your medical records, request corrections, and know how your information is being used. Always ensure you're using secure, HIPAA-compliant platforms for medical data.
        </div>
      </div>
    `
  };

  return templates[categoryKey] || `
    <div class="article-content">
      <h3>About This Article</h3>
      <p>${description}</p>
      
      <h3>Comprehensive Information</h3>
      <p>This article provides detailed, medically-reviewed information about ${title.toLowerCase()}. Our content is regularly updated to reflect the latest medical guidelines and research.</p>
      
      <h3>Key Educational Points</h3>
      <ul>
        <li>Evidence-based medical information</li>
        <li>Patient-friendly explanations</li>
        <li>Visual aids and examples</li>
        <li>Practical applications</li>
        <li>When to seek medical attention</li>
      </ul>
      
      <h3>Learning Objectives</h3>
      <p>After reading this article, you should be able to:</p>
      <ol>
        <li>Understand basic concepts related to this topic</li>
        <li>Recognize common terms and their meanings</li>
        <li>Know when to consult healthcare professionals</li>
        <li>Make informed decisions about your health</li>
        <li>Ask relevant questions during medical appointments</li>
      </ol>
      
      <div class="article-disclaimer">
        <strong>Important:</strong> This educational content is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </div>
    </div>
  `;
}

function Education() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showNotification, setShowNotification] = useState(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const modalRef = useRef(null);

  
  const articles = useMemo(() => [
    {
      id: 1,
      category: 'xray',
      image:"https://i.postimg.cc/D0R9f14k/26ad8149d1db71fec5b3f89f29eaf321.jpg",
      title: 'Understanding X-Ray Results',
      description: 'Learn how to read common X-ray findings and understand what different shadows and shapes mean in your images.',
      readTime: '5 min read',
      content: generateArticleContent('xray', 'Understanding X-Ray Results', 'Learn how to read common X-ray findings and understand what different shadows and shapes mean in your images.')
    },
    {
      id: 2,
      category: 'xray',
      image: 'https://i.postimg.cc/YSZg292Q/feee5209c6978776c96f57257e6a96dc.jpg',
      title: 'Chest X-Ray Interpretation',
      description: 'Learn to identify common chest conditions like pneumonia, tuberculosis, and lung nodules on X-ray images.',
      readTime: '6 min read',
      content: generateArticleContent('xray', 'Chest X-Ray Interpretation', 'Learn to identify common chest conditions like pneumonia, tuberculosis, and lung nodules on X-ray images.')
    },
    {
      id: 3,
      category: 'mri',
      image: 'https://i.postimg.cc/63zXL77r/4fa3b927e468f5e51e1b645d7fa65bdd.jpg',
      title: 'MRI Basics for Patients',
      description: 'What to expect during and after an MRI scan, including how the technology works and what your results might show.',
      readTime: '7 min read',
      content: generateArticleContent('mri', 'MRI Basics for Patients', 'What to expect during and after an MRI scan, including how the technology works and what your results might show.')
    },
    {
      id: 4,
      category: 'mri',
      image: 'https://i.postimg.cc/QMJGhBqK/5f2dfd80e762701e7f8feaadf9a6c735.jpg',
      title: 'Brain MRI: What to Look For',
      description: 'Understanding brain anatomy and common findings in MRI scans including tumors, strokes, and degenerative diseases.',
      readTime: '9 min read',
      content: generateArticleContent('mri', 'Brain MRI: What to Look For', 'Understanding brain anatomy and common findings in MRI scans including tumors, strokes, and degenerative diseases.')
    },
    {
      id: 5,
      category: 'ct',
      image: 'https://i.postimg.cc/hGrwNkSV/7dfb62f9022770b30c27270664f2592f.jpg',
      title: 'CT Scan Interpretation Guide',
      description: 'Understanding your CT scan results, including cross-sectional imaging and what different densities indicate.',
      readTime: '6 min read',
      content: generateArticleContent('ct', 'CT Scan Interpretation Guide', 'Understanding your CT scan results, including cross-sectional imaging and what different densities indicate.')
    },
    {
      id: 6,
      category: 'lab',
      image: 'https://i.postimg.cc/90qLXKjD/2a250a52241e895241cc1ec5f4bf4b4f.jpg',
      title: 'Blood Test Normal Ranges',
      description: 'What your lab values mean, including normal ranges for common blood tests and when to be concerned.',
      readTime: '8 min read',
      content: generateArticleContent('lab', 'Blood Test Normal Ranges', 'What your lab values mean, including normal ranges for common blood tests and when to be concerned.')
    },
    {
      id: 7,
      category: 'ai',
      image: 'https://i.postimg.cc/QdSwzLNx/29e30ffa6c7a9b40e4efeaab23f851bf.jpg',
      title: 'How AI Analyzes Medical Images',
      description: 'Understanding how artificial intelligence processes medical images and generates accurate diagnostic insights.',
      readTime: '4 min read',
      content: generateArticleContent('ai', 'How AI Analyzes Medical Images', 'Understanding how artificial intelligence processes medical images and generates accurate diagnostic insights.')
    },
    {
      id: 8,
      category: 'security',
      image: 'https://i.postimg.cc/wBm5mJrK/233be9725b4a85d2514d414f131177d0.jpg',
      title: 'Medical Data Privacy & Security',
      description: 'Learn how your medical data is protected, encrypted, and kept secure in compliance with HIPAA regulations.',
      readTime: '3 min read',
      content: generateArticleContent('security', 'Medical Data Privacy & Security', 'Learn how your medical data is protected, encrypted, and kept secure in compliance with HIPAA regulations.')
    },
    {
      id: 9,
      category: 'xray',
      image: 'https://i.postimg.cc/RFmtJYfN/b52a53a2d808e410e3e00cae1f2f99ee.jpg',
      title: 'Dental X-Rays Explained',
      description: 'Understanding different types of dental X-rays and what they reveal about your oral health.',
      readTime: '4 min read',
      content: generateArticleContent('xray', 'Dental X-Rays Explained', 'Understanding different types of dental X-rays and what they reveal about your oral health.')
    },
    {
      id: 10,
      category: 'lab',
      image: 'https://i.postimg.cc/2576MSb6/d1a34c5e9efd670f7b6c95684d3875b8.jpg',
      title: 'Understanding Blood Chemistry',
      description: 'A comprehensive guide to blood chemistry panels and what each component tells about your health.',
      readTime: '5 min read',
      content: generateArticleContent('lab', 'Understanding Blood Chemistry', 'A comprehensive guide to blood chemistry panels and what each component tells about your health.')
    },
    {
      id: 11,
      category: 'ai',
      image: 'https://i.postimg.cc/W45V0FqW/dcb25442fb0340fc07625668e7f251ed.jpg',
      title: 'AI in Early Disease Detection',
      description: 'How artificial intelligence is revolutionizing early detection of diseases through pattern recognition.',
      readTime: '6 min read',
      content: generateArticleContent('ai', 'AI in Early Disease Detection', 'How artificial intelligence is revolutionizing early detection of diseases through pattern recognition.')
    },
    {
      id: 12,
      category: 'security',
      image: 'https://i.postimg.cc/nrbnL8Qy/4402a120bd143d7f7e9240ae230ce1a1.jpg',
      title: 'HIPAA Compliance Guide',
      description: 'Understanding HIPAA regulations and how they protect your medical information privacy.',
      readTime: '4 min read',
      content: generateArticleContent('security', 'HIPAA Compliance Guide', 'Understanding HIPAA regulations and how they protect your medical information privacy.')
    }
  ], []);

 
  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'xray', label: 'X-Ray' },
    { id: 'mri', label: 'MRI' },
    { id: 'ct', label: 'CT Scan' },
    { id: 'lab', label: 'Lab Tests' },
    { id: 'ai', label: 'AI Technology' },
    { id: 'security', label: 'Security' }
  ];

  
  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(article => article.category === activeCategory);

  
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  
  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
    document.body.style.overflow = 'auto';
  };

  
  const handlePrintArticle = () => {
    if (!selectedArticle) return;

    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MedLab Education - ${selectedArticle.title}</title>
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 20px; 
            line-height: 1.6;
          }
          h1 { color: #2563EB; }
          h2 { color: #1E40AF; }
          h3 { color: #2563EB; margin-top: 20px; }
          .article-meta { 
            margin: 20px 0; 
            color: #64748B;
            font-size: 14px;
          }
          .article-content { line-height: 1.6; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #E2E8F0;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #F1F5F9;
            font-weight: 600;
          }
          ul, ol {
            margin: 15px 0;
            padding-left: 30px;
          }
          .article-tip, .article-warning, .article-note, .article-disclaimer {
            padding: 16px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
          }
          .article-tip {
            background: rgba(16, 185, 129, 0.1);
            border-left-color: #10B981;
          }
          .article-warning {
            background: rgba(245, 158, 11, 0.1);
            border-left-color: #F59E0B;
          }
          .article-note {
            background: rgba(59, 130, 246, 0.1);
            border-left-color: #3B82F6;
          }
          .article-disclaimer {
            background: rgba(239, 68, 68, 0.1);
            border-left-color: #EF4444;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${selectedArticle.title}</h1>
        <div class="article-meta">
          <span>Category: ${selectedArticle.category.toUpperCase()}</span> | 
          <span>Read Time: ${selectedArticle.readTime}</span>
        </div>
        ${selectedArticle.content}
        <div class="no-print" style="margin-top: 40px; font-style: italic; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px;">
          Printed from MedLab Education Center - ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // حفظ المقال
  const handleSaveArticle = () => {
    if (!selectedArticle) return;

    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');

    if (!savedArticles.some(article => article.title === selectedArticle.title)) {
      const newSavedArticle = {
        title: selectedArticle.title,
        category: selectedArticle.category.toUpperCase(),
        date: new Date().toISOString(),
        readTime: selectedArticle.readTime
      };

      const updatedSavedArticles = [...savedArticles, newSavedArticle];
      localStorage.setItem('savedArticles', JSON.stringify(updatedSavedArticles));
      setSavedArticles(updatedSavedArticles);

      showNotificationFunc('Article saved to your library!', 'success');
    } else {
      showNotificationFunc('Article already in your library!', 'info');
    }
  };

  
  const handleNewsletterSubscribe = () => {
    if (!validateEmail(newsletterEmail)) {
      showNotificationFunc('Please enter a valid email address.', 'error');
      return;
    }

    setNewsletterLoading(true);

    
    setTimeout(() => {
      const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      subscribers.push({
        email: newsletterEmail,
        date: new Date().toISOString(),
        category: 'education'
      });
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));

      showNotificationFunc('Thank you for subscribing to our medical education newsletter! You\'ll receive updates on new articles and resources.', 'success');
      setNewsletterEmail('');
      setNewsletterLoading(false);
    }, 1500);
  };

  
  const showNotificationFunc = (message, type = 'info') => {
    setShowNotification({ message, type });

    
    setTimeout(() => {
      setShowNotification(null);
    }, 5000);
  };

  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setSavedArticles(saved);

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && e.target.classList.contains('modal__overlay')) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [modalOpen]);

  // دالة لإنشاء المحتوى حسب التصنيف
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'xray': return 'xray-category';
      case 'mri': return 'mri-category';
      case 'ct': return 'ct-category';
      case 'lab': return 'lab-category';
      case 'ai': return 'ai-category';
      case 'security': return 'security-category';
      default: return '';
    }
  };

  return (
    <>
      <Header />

      {showNotification && (
        <div
          className={`notification notification-${showNotification.type}`}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: showNotification.type === 'success' ? 'var(--medical-success)' :
              showNotification.type === 'error' ? 'var(--medical-error)' :
                showNotification.type === 'warning' ? 'var(--medical-warning)' : 'var(--medical-primary)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10000,
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="notification-content" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span className="notification-icon" style={{ fontSize: '18px', flexShrink: 0 }}>
              {showNotification.type === 'success' ? '✅' :
                showNotification.type === 'error' ? '❌' :
                  showNotification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{showNotification.message}</span>
          </div>
          <button
            className="notification-close"
            onClick={() => setShowNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            &times;
          </button>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
              from { transform: translateX(0); opacity: 1; }
              to { transform: translateX(100%); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {modalOpen && selectedArticle && (
        <div className="modal active" id="articleModal">
          <div className="modal__overlay" onClick={closeModal}></div>
          <div className="modal__content" ref={modalRef}>
            <div className="modal__header">
              <h2 id="modalTitle">{selectedArticle.title}</h2>
              <button className="modal__close" id="closeModal" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal__body">
              <div className="article-meta">
                <span className={`article-category ${getCategoryStyles(selectedArticle.category)}`}>
                  {selectedArticle.category.toUpperCase()}
                </span>
                <span id="modalReadTime">{selectedArticle.readTime}</span>
              </div>
              <div id="modalContent" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
            <div className="modal__footer">
              <button className="btn btn--secondary" id="printArticle" onClick={handlePrintArticle}>
                Print
              </button>
              <button className="btn btn--primary" id="saveArticle" onClick={handleSaveArticle}>
                {savedArticles.some(article => article.title === selectedArticle.title) ? 'Saved ✓' : 'Save to Library'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="education-page">
        <div className="container">
          <section className="education-hero">
            <div className="education-hero__content">
              <h1 className="education-hero__title">Medical Education Center</h1>
              <p className="education-hero__subtitle">
                Learn about medical imaging, understand your results, and stay informed about your health
                with our comprehensive educational resources.
              </p>

              <div className="category-filter">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="education-content">
            <div className="education-grid">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="card education-card"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, z-index 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    e.currentTarget.style.zIndex = '10';
                    const icon = e.currentTarget.querySelector('.education-card__icon');
                    if (icon) {
                      icon.style.animation = 'float 1.5s ease-in-out infinite';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.zIndex = '1';
                    const icon = e.currentTarget.querySelector('.education-card__icon');
                    if (icon) {
                      icon.style.animation = 'float 3s ease-in-out infinite';
                    }
                  }}
                  onClick={(e) => {
                    if (!e.target.closest('.education-card__btn')) {
                      openArticleModal(article);
                    }
                  }}
                >
                    <div
                      className="education-card__image"
                      style={{ backgroundImage: `url(${article.image})` }}
                    >
                      <div className="education-card__overlay">
                        <span className="education-card__read-time">
                          {article.readTime}
                        </span>
                      </div>
                
                    


                                {/* <div className="education-card__overlay">
    <span className="education-card__read-time">{article.readTime}</span>
  </div> */}
                  </div>
                  <div className="card__body">
                    <div className="education-card__header">
                      <span className={`education-card__category ${getCategoryStyles(article.category)}`}>
                        {article.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="education-card__title">{article.title}</h3>
                    <p className="education-card__description">{article.description}</p>
                    <div className="education-card__footer">
                      <button
                        className="btn btn--primary education-card__btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openArticleModal(article);
                        }}
                      >
                        Read Article
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          
            {filteredArticles.length === 0 && (
              <div className="no-results active">
                <div className="no-results__icon">📚</div>
                <h3 className="no-results__title">No articles found in this category</h3>
                <p className="no-results__description">
                  Try selecting a different category or check back soon for new articles.
                </p>
                <button
                  className="btn btn--primary no-results__btn"
                  onClick={() => handleCategoryFilter('all')}
                >
                  Show All Articles
                </button>
              </div>
            )}
          </section>
        </div>

        
        <footer className="footer">
          <div className="container">
            <div className="footer__content">
              <div className="footer__section footer__brand">
        <div className="footer__logo">
          <img
            src="https://i.postimg.cc/dVxJWzgh/11111.png"
            alt="MedLab Logo"
            className="logo__img"
          />
          <span className="logo__text" style={{color:"white" }}>
            Skeleti-<span className="edit" style={{ color: "#0EA5E9" }}><img src="https://i.postimg.cc/dVxJWzgh/11111.png" className="logo_img_1" alt="Skeleti-x logo" /></span>
          </span>
        </div>
                <p className="footer__description">
                  Transform your medical imaging with AI-powered analysis. Fast, accurate, and patient-friendly results.
                </p>

                <div className="footer__social">
                  <h5 className="footer__social-title">Follow Us</h5>
                  <div className="social-links">
                    <button type="button" className="social-link">🐦 Twitter</button>
                    <button type="button" className="social-link">🗺 LinkedIn</button>
                    <button type="button" className="social-link">📱 Facebook</button>
                  </div>
                </div>
              </div>

              <div className="footer__section">
                <h4 className="footer__section-title">Quick Links</h4>
                <ul className="footer__links">
                  <li><Link to="/upload">Upload Files</Link></li>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/reports">View Reports</Link></li>
                  <li><Link to="/chatbot">AI Assistant</Link></li>
                  <li><Link to="/education" className="active">Education Center</Link></li>
                </ul>
              </div>

              <div className="footer__section">
                <h4 className="footer__section-title">Resources</h4>
                <ul className="footer__links">
                  <li><button type="button" className="footer-link-button">Help Center</button></li>
                  <li><button type="button" className="footer-link-button">API Documentation</button></li>
                  <li><button type="button" className="footer-link-button">Medical Guidelines</button></li>
                  <li><button type="button" className="footer-link-button">Research Papers</button></li>
                  <li><button type="button" className="footer-link-button">Blog</button></li>
                </ul>
              </div>

              <div className="footer__section">
                <h4 className="footer__section-title">Newsletter</h4>
                <p className="footer__newsletter-text">
                  Stay updated with the latest in AI medical technology
                </p>
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
                  />
                  <button
                    className="newsletter-btn"
                    onClick={handleNewsletterSubscribe}
                    disabled={newsletterLoading}
                  >
                    {newsletterLoading ? (
                      <span className="loading-spinner">⏳</span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                <div className="footer__badges">
                  <div className="compliance-badge">
                    <span className="badge-icon">🛡️</span>
                    <span className="badge-text">HIPAA Compliant</span>
                  </div>
                  <div className="compliance-badge">
                    <span className="badge-icon">🏆</span>
                    <span className="badge-text">FDA Approved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer__bottom">
              <div className="footer__bottom-content">
                <div className="footer__copyright">
                  <p>&copy; 2025 Skeleti-x. All rights reserved.</p>
                </div>
                <div className="footer__legal">
                  <button type="button" className="footer-link-button">Privacy Policy</button>
                  <button type="button" className="footer-link-button">Terms of Service</button>
                  <button type="button" className="footer-link-button">Cookie Policy</button>
                  <button type="button" className="footer-link-button">Accessibility</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .education-card__icon {
          transition: transform 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }
        
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default Education;