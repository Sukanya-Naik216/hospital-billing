CREATE DATABASE IF NOT EXISTS hospital_billing;
USE hospital_billing;

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT,
  gender ENUM('Male','Female','Other'),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  insurance_provider VARCHAR(100),
  insurance_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category ENUM('Consultation','Lab','Radiology','Surgery','Pharmacy','Room','Emergency','Other') NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_number VARCHAR(30) UNIQUE NOT NULL,
  patient_id INT NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('Draft','Pending','Paid','Partial','Overdue','Cancelled') DEFAULT 'Pending',
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  tax_percent DECIMAL(5,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS bill_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  service_id INT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  method ENUM('Cash','Card','UPI','Insurance','Cheque','NetBanking') NOT NULL,
  reference_no VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id)
);

INSERT INTO services (code, name, category, unit_price) VALUES
('CONS001','General Consultation','Consultation',500.00),
('CONS002','Specialist Consultation','Consultation',1200.00),
('LAB001','Complete Blood Count (CBC)','Lab',350.00),
('LAB002','Lipid Profile','Lab',600.00),
('LAB003','Liver Function Test','Lab',800.00),
('RAD001','Chest X-Ray','Radiology',700.00),
('RAD002','Ultrasound Abdomen','Radiology',1500.00),
('RAD003','MRI Brain','Radiology',8000.00),
('SURG001','Minor Surgery','Surgery',5000.00),
('ROOM001','General Ward (per day)','Room',1500.00),
('ROOM002','Semi-Private Room (per day)','Room',3000.00),
('ROOM003','Private Room (per day)','Room',5000.00),
('PHARM001','Medication Package','Pharmacy',250.00),
('EMG001','Emergency Consultation','Emergency',2000.00);

INSERT INTO patients (patient_id, name, age, gender, phone, email, insurance_provider) VALUES
('PAT001','Rajesh Kumar',45,'Male','9876543210','rajesh@email.com','Star Health'),
('PAT002','Priya Sharma',32,'Female','9845671230','priya@email.com','HDFC Ergo'),
('PAT003','Amit Patel',58,'Male','9912345678','amit@email.com',NULL),
('PAT004','Sunita Desai',27,'Female','9823456789','sunita@email.com','New India Assurance'),
('PAT005','Rahul Verma',40,'Male','9765432109','rahul@email.com','Bajaj Allianz');