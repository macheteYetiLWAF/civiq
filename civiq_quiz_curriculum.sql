-- ============================================================================
-- CIVIQ Quiz Curriculum Schema
-- Hierarchical structure for civic education quizzes
-- ============================================================================

DROP TABLE IF EXISTS `civiq_quiz_questions`;
DROP TABLE IF EXISTS `civiq_quiz_topics`;

-- ============================================================================
-- QUIZ TOPICS TABLE - Hierarchical curriculum structure
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_quiz_topics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT NULL,
  `level` ENUM('root', 'category', 'subcategory', 'topic') NOT NULL DEFAULT 'topic',
  `government_level` ENUM('federal', 'state', 'local', 'all') DEFAULT 'all',
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100) DEFAULT NULL,
  `color` VARCHAR(7) DEFAULT '#8B5CF6',
  `question_count` INT DEFAULT 0,
  `difficulty` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `civiq_quiz_topics`(`id`) ON DELETE SET NULL,
  INDEX idx_parent (parent_id),
  INDEX idx_code (code),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- QUIZ QUESTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_quiz_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `topic_id` INT NOT NULL,
  `question_type` ENUM('multiple_choice', 'true_false', 'fill_blank', 'matching') DEFAULT 'multiple_choice',
  `question_text` TEXT NOT NULL,
  `correct_answer` VARCHAR(500) NOT NULL,
  `wrong_answer_1` VARCHAR(500),
  `wrong_answer_2` VARCHAR(500),
  `wrong_answer_3` VARCHAR(500),
  `explanation` TEXT,
  `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  `points` INT DEFAULT 10,
  `time_limit_seconds` INT DEFAULT 30,
  `source_url` VARCHAR(500),
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`topic_id`) REFERENCES `civiq_quiz_topics`(`id`) ON DELETE CASCADE,
  INDEX idx_topic (topic_id),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: CURRICULUM STRUCTURE
-- ============================================================================

-- ROOT CATEGORIES
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
(NULL, 'root', 'federal', 'FEDERAL', 'Federal Government', 'Understanding the United States federal government structure, powers, and processes', 'fa-landmark', '#64748B', 1),
(NULL, 'root', 'state', 'STATE', 'State Government', 'Pennsylvania state government, constitution, and processes', 'fa-building-columns', '#10B981', 2),
(NULL, 'root', 'local', 'LOCAL', 'Local Government', 'County, municipal, and school district governance', 'fa-city', '#F59E0B', 3),
(NULL, 'root', 'all', 'MEDIA', 'Media Literacy', 'Understanding news sources, bias, and fact-checking', 'fa-newspaper', '#7C3AED', 4),
(NULL, 'root', 'all', 'CIVIC', 'Civic Participation', 'Voting, advocacy, and community engagement', 'fa-vote-yea', '#EC4899', 5);

-- FEDERAL SUBCATEGORIES
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'FEDERAL'), 'category', 'federal', 'FED_EXEC', 'Executive Branch', 'The President, Cabinet, and federal agencies', 'fa-building-flag', '#64748B', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FEDERAL'), 'category', 'federal', 'FED_LEG', 'Legislative Branch', 'Congress: House of Representatives and Senate', 'fa-gavel', '#64748B', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FEDERAL'), 'category', 'federal', 'FED_JUD', 'Judicial Branch', 'Supreme Court and federal court system', 'fa-scale-balanced', '#64748B', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FEDERAL'), 'category', 'federal', 'FED_CONST', 'Constitution & Amendments', 'The founding document and its amendments', 'fa-scroll', '#64748B', 4),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FEDERAL'), 'category', 'federal', 'FED_HIST', 'Federal History', 'Key moments in federal government history', 'fa-landmark-dome', '#64748B', 5);

-- EXECUTIVE BRANCH TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, difficulty, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'subcategory', 'federal', 'PRES_ROLE', 'Role of the President', 'Presidential powers, responsibilities, and limitations', 'fa-user-tie', 'beginner', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'subcategory', 'federal', 'PRES_ELECT', 'Presidential Elections', 'Electoral college, primaries, and campaign process', 'fa-check-to-slot', 'intermediate', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'subcategory', 'federal', 'CABINET', 'The Cabinet', 'Executive departments and their secretaries', 'fa-users', 'intermediate', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'subcategory', 'federal', 'FED_AGENCIES', 'Federal Agencies', 'Independent agencies and regulatory bodies', 'fa-building', 'advanced', 4),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'subcategory', 'federal', 'EXEC_ORDERS', 'Executive Orders', 'Presidential directives and their scope', 'fa-file-signature', 'advanced', 5),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_EXEC'), 'topic', 'federal', 'ALL_PRESIDENTS', 'U.S. Presidents', 'All 47 presidents from Washington to present', 'fa-flag-usa', 'intermediate', 6);

-- LEGISLATIVE BRANCH TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, difficulty, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_LEG'), 'subcategory', 'federal', 'HOUSE', 'House of Representatives', 'The lower chamber: representation and powers', 'fa-users-viewfinder', 'beginner', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_LEG'), 'subcategory', 'federal', 'SENATE', 'The Senate', 'The upper chamber: unique powers and procedures', 'fa-landmark-dome', 'beginner', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_LEG'), 'subcategory', 'federal', 'BILL_PROCESS', 'How a Bill Becomes Law', 'The legislative process from introduction to signature', 'fa-file-invoice', 'intermediate', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_LEG'), 'subcategory', 'federal', 'COMMITTEES', 'Congressional Committees', 'Standing, select, and joint committees', 'fa-people-group', 'intermediate', 4),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_LEG'), 'subcategory', 'federal', 'CONGRESS_POWERS', 'Powers of Congress', 'Enumerated powers, implied powers, and limitations', 'fa-shield-halved', 'advanced', 5);

-- JUDICIAL BRANCH TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, difficulty, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_JUD'), 'subcategory', 'federal', 'SCOTUS', 'Supreme Court', 'The highest court: composition and jurisdiction', 'fa-scale-balanced', 'beginner', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_JUD'), 'subcategory', 'federal', 'FED_COURTS', 'Federal Court System', 'District courts, circuit courts, and appeals', 'fa-building-columns', 'intermediate', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_JUD'), 'subcategory', 'federal', 'LANDMARK_CASES', 'Landmark Cases', 'Cases that shaped American law and society', 'fa-book-bookmark', 'advanced', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_JUD'), 'subcategory', 'federal', 'JUDICIAL_REVIEW', 'Judicial Review', 'The power to interpret the Constitution', 'fa-magnifying-glass', 'advanced', 4);

-- CONSTITUTION TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, difficulty, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_CONST'), 'subcategory', 'federal', 'CONST_PREAMBLE', 'Preamble & Articles', 'The structure and original text of the Constitution', 'fa-file-lines', 'beginner', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_CONST'), 'subcategory', 'federal', 'BILL_RIGHTS', 'Bill of Rights', 'The first ten amendments and your freedoms', 'fa-list-check', 'beginner', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_CONST'), 'subcategory', 'federal', 'CIVIL_WAR_AMEND', 'Civil War Amendments', '13th, 14th, and 15th Amendments', 'fa-link', 'intermediate', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_CONST'), 'subcategory', 'federal', 'MODERN_AMEND', 'Modern Amendments', 'Amendments 16-27 and the amendment process', 'fa-plus', 'intermediate', 4),
((SELECT id FROM civiq_quiz_topics WHERE code = 'FED_CONST'), 'topic', 'federal', 'FOUNDING_DOCS', 'Founding Documents', 'Declaration of Independence, Federalist Papers, and more', 'fa-scroll', 'advanced', 5);

-- STATE GOVERNMENT TOPICS (Pennsylvania)
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'STATE'), 'category', 'state', 'PA_EXEC', 'Governor & Executive', 'Pennsylvania governor, Lt. Governor, and executive agencies', 'fa-building-flag', '#10B981', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'STATE'), 'category', 'state', 'PA_LEG', 'General Assembly', 'PA House and Senate structure and processes', 'fa-gavel', '#10B981', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'STATE'), 'category', 'state', 'PA_COURTS', 'PA Court System', 'Commonwealth court, superior court, and supreme court', 'fa-scale-balanced', '#10B981', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'STATE'), 'category', 'state', 'PA_CONST', 'PA Constitution', 'Pennsylvania state constitution and amendments', 'fa-scroll', '#10B981', 4),
((SELECT id FROM civiq_quiz_topics WHERE code = 'STATE'), 'category', 'state', 'PA_HIST', 'Pennsylvania History', 'From William Penn to the present', 'fa-book-open', '#10B981', 5);

-- LOCAL GOVERNMENT TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'LOCAL'), 'category', 'local', 'COUNTY_GOV', 'County Government', 'County commissioners, managers, and services', 'fa-building', '#F59E0B', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'LOCAL'), 'category', 'local', 'MUNICIPAL_GOV', 'Municipal Government', 'City councils, mayors, and local ordinances', 'fa-city', '#F59E0B', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'LOCAL'), 'category', 'local', 'SCHOOL_BOARD', 'School Boards', 'Educational governance and local school policy', 'fa-school', '#F59E0B', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'LOCAL'), 'category', 'local', 'LOCAL_SERVICES', 'Local Services', 'Police, fire, utilities, and public works', 'fa-truck-medical', '#F59E0B', 4);

-- MEDIA LITERACY TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'MEDIA'), 'category', 'all', 'NEWS_SOURCES', 'Understanding News Sources', 'Types of media, ownership, and funding models', 'fa-newspaper', '#7C3AED', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'MEDIA'), 'category', 'all', 'BIAS_DETECTION', 'Detecting Bias', 'Identifying partisan framing and loaded language', 'fa-magnifying-glass-chart', '#7C3AED', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'MEDIA'), 'category', 'all', 'FACT_CHECK', 'Fact-Checking Skills', 'Verifying claims and finding primary sources', 'fa-clipboard-check', '#7C3AED', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'MEDIA'), 'category', 'all', 'MISINFO', 'Misinformation & Propaganda', 'Recognizing manipulation and false narratives', 'fa-circle-exclamation', '#7C3AED', 4);

-- CIVIC PARTICIPATION TOPICS
INSERT INTO `civiq_quiz_topics` (parent_id, level, government_level, code, title, description, icon, color, sort_order) VALUES
((SELECT id FROM civiq_quiz_topics WHERE code = 'CIVIC'), 'category', 'all', 'VOTING', 'Voting & Elections', 'Registration, polling, and election types', 'fa-check-to-slot', '#EC4899', 1),
((SELECT id FROM civiq_quiz_topics WHERE code = 'CIVIC'), 'category', 'all', 'ADVOCACY', 'Civic Advocacy', 'Contacting officials, petitions, and campaigns', 'fa-bullhorn', '#EC4899', 2),
((SELECT id FROM civiq_quiz_topics WHERE code = 'CIVIC'), 'category', 'all', 'COMMUNITY', 'Community Engagement', 'Local meetings, volunteering, and civic duty', 'fa-hands-holding-circle', '#EC4899', 3),
((SELECT id FROM civiq_quiz_topics WHERE code = 'CIVIC'), 'category', 'all', 'RIGHTS_RESP', 'Rights & Responsibilities', 'Constitutional rights and civic obligations', 'fa-handshake', '#EC4899', 4);

-- ============================================================================
-- SAMPLE QUESTIONS - Presidential Knowledge
-- ============================================================================

INSERT INTO `civiq_quiz_questions` (topic_id, question_type, question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, explanation, difficulty, points) VALUES

-- President Role questions (beginner)
((SELECT id FROM civiq_quiz_topics WHERE code = 'PRES_ROLE'), 'multiple_choice',
'What is the minimum age requirement to become President of the United States?',
'35 years old', '30 years old', '40 years old', '25 years old',
'Article II, Section 1 of the Constitution requires the President to be at least 35 years old, a natural-born citizen, and a resident of the U.S. for at least 14 years.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'PRES_ROLE'), 'multiple_choice',
'How long is a presidential term?',
'4 years', '2 years', '6 years', '5 years',
'The President serves a four-year term. The 22nd Amendment limits presidents to two terms maximum.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'PRES_ROLE'), 'multiple_choice',
'Which power allows the President to reject a bill passed by Congress?',
'Veto', 'Filibuster', 'Executive Order', 'Pardon',
'The President can veto (reject) legislation. Congress can override a veto with a 2/3 majority in both chambers.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'PRES_ROLE'), 'true_false',
'The President can declare war without congressional approval.',
'False', '', '', '',
'Only Congress has the power to declare war (Article I, Section 8). The President is Commander-in-Chief but cannot formally declare war.',
'medium', 15),

-- House of Representatives questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'HOUSE'), 'multiple_choice',
'How many members are in the U.S. House of Representatives?',
'435', '100', '535', '350',
'The House has 435 voting members, apportioned among states based on population. This number was fixed by the Reapportionment Act of 1929.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'HOUSE'), 'multiple_choice',
'How long is a term in the House of Representatives?',
'2 years', '4 years', '6 years', '3 years',
'House members serve 2-year terms, meaning the entire House is up for election every two years.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'HOUSE'), 'multiple_choice',
'What is the minimum age to serve in the House of Representatives?',
'25 years old', '21 years old', '30 years old', '35 years old',
'Article I, Section 2 requires Representatives to be at least 25 years old, a U.S. citizen for at least 7 years, and a resident of the state they represent.',
'easy', 10),

-- Senate questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'SENATE'), 'multiple_choice',
'How many Senators does each state have?',
'2', '1', '3', 'Based on population',
'Each state has exactly 2 Senators regardless of population, giving all states equal representation in the upper chamber.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'SENATE'), 'multiple_choice',
'How long is a Senate term?',
'6 years', '2 years', '4 years', '8 years',
'Senators serve 6-year terms. Elections are staggered so about 1/3 of the Senate is up for election every 2 years.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'SENATE'), 'multiple_choice',
'Which chamber has the sole power to confirm presidential appointments?',
'Senate', 'House of Representatives', 'Both chambers equally', 'Supreme Court',
'The Senate has "advice and consent" power over presidential appointments including Cabinet members, ambassadors, and federal judges.',
'medium', 15),

-- Supreme Court questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'SCOTUS'), 'multiple_choice',
'How many justices currently serve on the Supreme Court?',
'9', '7', '11', '12',
'The Supreme Court has had 9 justices since 1869. The Constitution does not specify a number; Congress sets it by law.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'SCOTUS'), 'multiple_choice',
'How long do Supreme Court justices serve?',
'Life tenure (until death, retirement, or impeachment)', '10 years', '20 years', 'Until age 70',
'Article III grants federal judges, including Supreme Court justices, lifetime appointments "during good Behaviour."',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'SCOTUS'), 'multiple_choice',
'Who nominates Supreme Court justices?',
'The President', 'The Senate', 'The House of Representatives', 'State governors',
'The President nominates Supreme Court justices. The Senate then votes to confirm or reject the nomination.',
'easy', 10),

-- Bill of Rights questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'BILL_RIGHTS'), 'multiple_choice',
'Which amendment protects freedom of speech, religion, and the press?',
'First Amendment', 'Second Amendment', 'Fifth Amendment', 'Tenth Amendment',
'The First Amendment prohibits Congress from making laws respecting establishment of religion, or abridging freedom of speech, press, assembly, and petition.',
'easy', 10),

((SELECT id FROM civiq_quiz_topics WHERE code = 'BILL_RIGHTS'), 'multiple_choice',
'Which amendment protects against unreasonable searches and seizures?',
'Fourth Amendment', 'Second Amendment', 'Sixth Amendment', 'Eighth Amendment',
'The Fourth Amendment requires search warrants to be judicially sanctioned and supported by probable cause.',
'medium', 15),

((SELECT id FROM civiq_quiz_topics WHERE code = 'BILL_RIGHTS'), 'multiple_choice',
'How many amendments are in the Bill of Rights?',
'10', '5', '12', '27',
'The Bill of Rights consists of the first 10 amendments, ratified in 1791. The Constitution currently has 27 total amendments.',
'easy', 10),

-- Media Literacy questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'BIAS_DETECTION'), 'multiple_choice',
'What is "confirmation bias" in news consumption?',
'Seeking out news that confirms existing beliefs', 'Believing everything you read', 'Only reading local news', 'Watching multiple news channels',
'Confirmation bias leads people to favor information that confirms their preexisting beliefs while dismissing contradictory evidence.',
'medium', 15),

((SELECT id FROM civiq_quiz_topics WHERE code = 'FACT_CHECK'), 'multiple_choice',
'What is a "primary source" in journalism?',
'Original documents or firsthand accounts', 'Any published newspaper article', 'Wikipedia articles', 'Social media posts',
'Primary sources are original materials like official documents, direct interviews, or firsthand accounts, as opposed to secondary analysis.',
'medium', 15),

-- Voting questions
((SELECT id FROM civiq_quiz_topics WHERE code = 'VOTING'), 'multiple_choice',
'In Pennsylvania, how many days before an election must you register to vote?',
'15 days', '30 days', '7 days', 'Election day registration allowed',
'Pennsylvania requires voter registration at least 15 days before an election. Some states allow same-day registration.',
'medium', 15),

((SELECT id FROM civiq_quiz_topics WHERE code = 'VOTING'), 'multiple_choice',
'What is a "primary election"?',
'An election where parties choose their candidates', 'The main general election', 'A local-only election', 'An election with no party affiliation',
'Primary elections allow registered party members to vote for their preferred candidate to represent the party in the general election.',
'easy', 10);

-- Update question counts
UPDATE civiq_quiz_topics t
SET question_count = (
    SELECT COUNT(*)
    FROM civiq_quiz_questions q
    WHERE q.topic_id = t.id
);
