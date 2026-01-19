-- CIVIQ Eastern Pennsylvania News Sources Database Schema and Seed Data
-- Generated: 2026-01-04
-- Target Area: Luzerne, Lackawanna, Monroe, Northampton, Lehigh Counties

-- ============================================================================
-- TABLE: civiq_news_sources
-- Main catalog of news publications and broadcast outlets
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_news_sources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `type` ENUM('newspaper_daily', 'newspaper_weekly', 'tv_station', 'radio_station', 'online_only', 'nonprofit_news', 'public_media') NOT NULL,
  `ownership` VARCHAR(255),
  `parent_company` VARCHAR(255),
  `publication_frequency` VARCHAR(100),
  `paywall_status` ENUM('free', 'metered', 'hard_paywall', 'freemium') DEFAULT 'metered',
  `rss_feed_url` VARCHAR(500),
  `twitter_handle` VARCHAR(100),
  `facebook_url` VARCHAR(500),
  `instagram_handle` VARCHAR(100),
  `founded_year` INT,
  `notes` TEXT,
  `active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: civiq_source_coverage
-- Maps news sources to their geographic coverage areas
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_source_coverage` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source_id` INT NOT NULL,
  `county` VARCHAR(100) NOT NULL,
  `cities` TEXT COMMENT 'JSON array of cities covered',
  `is_primary` BOOLEAN DEFAULT FALSE COMMENT 'Primary coverage area vs secondary',
  FOREIGN KEY (`source_id`) REFERENCES `civiq_news_sources`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: civiq_government_sources
-- Local and state government data sources
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_government_sources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `type` ENUM('county', 'city', 'township', 'school_board', 'state_agency', 'state_legislature', 'state_courts', 'open_data_portal') NOT NULL,
  `jurisdiction` VARCHAR(255) NOT NULL,
  `county` VARCHAR(100),
  `has_agenda_portal` BOOLEAN DEFAULT FALSE,
  `has_meeting_videos` BOOLEAN DEFAULT FALSE,
  `has_open_records` BOOLEAN DEFAULT FALSE,
  `meeting_schedule` VARCHAR(255),
  `contact_phone` VARCHAR(50),
  `contact_email` VARCHAR(255),
  `notes` TEXT,
  `active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: civiq_rss_feeds
-- Individual RSS feeds from sources (one source may have multiple feeds)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_rss_feeds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source_id` INT NOT NULL,
  `feed_url` VARCHAR(500) NOT NULL,
  `feed_name` VARCHAR(255),
  `category` VARCHAR(100) COMMENT 'news, sports, opinion, local, etc.',
  `last_checked` TIMESTAMP,
  `last_successful` TIMESTAMP,
  `active` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`source_id`) REFERENCES `civiq_news_sources`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SEED DATA: NEWS SOURCES
-- ============================================================================

INSERT INTO `civiq_news_sources`
(`name`, `url`, `type`, `ownership`, `parent_company`, `publication_frequency`, `paywall_status`, `rss_feed_url`, `twitter_handle`, `facebook_url`, `instagram_handle`, `founded_year`, `notes`)
VALUES

-- LUZERNE COUNTY (Primary Pilot Area)

('Times Leader', 'https://www.timesleader.com/', 'newspaper_daily', 'Avant Publications', 'Avant Publications (Champion Media/MIDTC)', 'Daily', 'metered', NULL, '@TimesLeader', 'https://www.facebook.com/timesleader', NULL, 1879, 'Primary Wilkes-Barre daily. Largest audience in Luzerne County. Morning broadsheet. Acquired by Avant Publications in August 2019, ending 4 decades of corporate ownership.'),

('The Citizens'' Voice', 'https://www.citizensvoice.com/', 'newspaper_daily', 'MediaNews Group', 'Alden Global Capital', 'Daily', 'metered', NULL, '@CitizensVoice', 'https://www.facebook.com/citizensvoice', NULL, 1978, 'Founded as strike paper by Newspaper Guild. Known as "the union paper." Sold to Times-Shamrock in 2000, then to MediaNews Group/Alden Global Capital in August 2023.'),

('Sunday Dispatch', 'https://www.psdispatch.com/', 'newspaper_weekly', 'Avant Publications', 'Avant Publications', 'Weekly (Sunday)', 'free', NULL, NULL, NULL, NULL, 1947, 'Serves Greater Pittston area including Pittston Area and Wyoming Area School Districts. Part of Times Leader Media Group.'),

('The Abington Journal', 'https://www.theabingtonjournal.com/', 'newspaper_weekly', 'Cypress Media', NULL, 'Weekly (Thursday)', 'free', NULL, '@AbingtonJournal', NULL, NULL, 1947, 'Serves Greater Abington area, based in Clarks Summit. Covers southern Lackawanna County near Luzerne border.'),

('The Weekender', 'https://www.timesleader.com/weekender/', 'newspaper_weekly', 'Avant Publications', 'Avant Publications', 'Weekly', 'free', NULL, NULL, NULL, NULL, NULL, 'Arts and entertainment publication. Part of Times Leader Media Group.'),

-- LACKAWANNA COUNTY

('The Times-Tribune', 'https://www.thetimes-tribune.com/', 'newspaper_daily', 'MediaNews Group', 'Alden Global Capital', 'Daily', 'metered', 'https://www.thetimes-tribune.com/feed/', '@TTScrantonNews', 'https://www.facebook.com/taborathetimestribune', NULL, 1870, 'Primary Scranton daily. Formed in 2005 from merger of Scranton Tribune and Scranton Times. Owned by Lynett family until 2023 sale to MediaNews Group/Alden.'),

('Go Lackawanna', 'https://www.golackawanna.com/', 'online_only', 'Independent', NULL, 'Continuous', 'free', NULL, NULL, 'https://www.facebook.com/GoLackawanna', NULL, NULL, 'Free Scranton and Lackawanna County news, obituaries, events calendar, sports.'),

-- MONROE COUNTY

('Pocono Record', 'https://www.poconorecord.com/', 'newspaper_daily', 'Gannett/USA Today Network', 'Gannett (GateHouse Media)', 'Daily', 'metered', NULL, '@PoconoRecord', 'https://www.facebook.com/poconorecord', NULL, 1894, 'Newspaper of record for Monroe County. Founded as Stroudsburg Daily Times. Part of USA Today Network. Covers Monroe, parts of Pike, Lackawanna, Wayne, Carbon counties.'),

('The Pocono Times', 'https://www.thepoconotimes.com/', 'newspaper_weekly', 'Independent', NULL, 'Weekly (Wednesday)', 'free', NULL, NULL, NULL, NULL, 1983, '20,000 circulation weekly. 10,000 mailed, 10,000 distributed to stores. Services Stroudsburg, East Stroudsburg, Bushkill, Effort areas.'),

('The West End Reporter', 'https://www.thewestendreporter.com/', 'newspaper_weekly', 'Independent', NULL, 'Weekly', 'free', NULL, NULL, NULL, NULL, NULL, 'Serves West End of Monroe County.'),

('Stroudsburg Herald', 'https://stroudsburgherald.com/', 'online_only', 'Independent', NULL, 'Continuous', 'free', NULL, NULL, NULL, NULL, NULL, 'Local online news. Tagline: "For Locals, By Locals."'),

-- LEHIGH COUNTY

('The Morning Call', 'https://www.mcall.com/', 'newspaper_daily', 'Tribune Publishing', 'Alden Global Capital', 'Daily', 'metered', 'https://www.mcall.com/latest-headlines/feed/', '@mcall', 'https://www.facebook.com/themorningcall', '@themorningcall', 1883, 'Primary Allentown daily. Second-longest continuously published in Lehigh Valley. Closed Allentown HQ in 2020. ~115K Facebook, ~90K Twitter followers.'),

('Lehigh Valley Press', 'https://www.lvpnews.com/', 'newspaper_weekly', 'Times News Inc.', 'Pencor Services Inc.', 'Weekly', 'metered', NULL, NULL, NULL, NULL, 1987, 'Group of 8 weekly newspapers covering Bethlehem, Catasauqua, East Penn, Northampton, Northwestern, Parkland, Salisbury, Whitehall-Coplay areas. Family-owned by Palmerton-based Pencor.'),

('LehighValleyNews.com', 'https://www.lehighvalleynews.com/', 'online_only', 'Nonprofit/Independent', NULL, 'Continuous', 'free', NULL, NULL, NULL, NULL, NULL, 'Free local news source, independent and nonprofit. Covers Allentown, Bethlehem, Easton and surrounding Lehigh Valley.'),

('Lehigh Daily', 'https://lehighdaily.com/', 'online_only', 'Independent', NULL, 'Continuous', 'free', NULL, NULL, NULL, NULL, NULL, 'Covers Lehigh Valley including Allentown, Bethlehem, Easton. Offers email newsletter.'),

-- NORTHAMPTON COUNTY

('The Express-Times / LehighValleyLive', 'https://www.lehighvalleylive.com/', 'online_only', 'Advance Local', 'Advance Publications', 'Continuous', 'metered', NULL, '@ExpressTimes', 'https://www.facebook.com/expresstimes', NULL, 1855, 'Founded as Easton Daily Express. Print edition discontinued February 2025 after 170 years. Now online-only at lehighvalleylive.com. Covers Lehigh/Northampton PA and Warren/Hunterdon NJ.'),

-- MULTI-COUNTY / HAZLETON AREA

('Standard-Speaker', 'https://www.standardspeaker.com/', 'newspaper_daily', 'MediaNews Group', 'Alden Global Capital', 'Daily', 'metered', NULL, NULL, NULL, NULL, 1866, 'Hazleton area daily. Traces history to Hazleton Sentinel (1866). Sold to MediaNews Group September 2023. Covers Luzerne County southern area.'),

-- TV STATIONS

('WNEP-TV (ABC 16)', 'https://www.wnep.com/', 'tv_station', 'TEGNA Inc.', 'TEGNA Inc.', 'Continuous', 'free', NULL, '@WNABOREP', 'https://www.facebook.com/wnaborep', '@wnborep', 1957, 'ABC affiliate. Studios in Moosic. Dominant station in market. Covers Scranton/Wilkes-Barre/Hazleton DMA. Divested from Nexstar to TEGNA in 2019.'),

('WBRE-TV (NBC 28)', 'https://www.pahomepage.com/', 'tv_station', 'Nexstar Media Group', 'Nexstar Media Group', 'Continuous', 'free', 'https://www.pahomepage.com/rss-feeds/', '@WBREtv', 'https://www.facebook.com/WBREnews', NULL, 1953, 'NBC affiliate. Shared operations with WYOU under "28/22 News" brand. Studios on South Franklin Street, Wilkes-Barre.'),

('WYOU-TV (CBS 22)', 'https://www.pahomepage.com/', 'tv_station', 'Mission Broadcasting (operated by Nexstar)', 'Nexstar Media Group (operator)', 'Continuous', 'free', 'https://www.pahomepage.com/rss-feeds/', '@WYOUtv', NULL, NULL, 1953, 'CBS affiliate. Owned by Mission Broadcasting but operated by Nexstar via shared services agreement. First SSA in broadcasting history (1998).'),

('WOLF-TV (FOX 56)', 'https://fox56.com/', 'tv_station', 'New Age Media (operated by Sinclair)', 'Sinclair Broadcast Group', 'Continuous', 'free', NULL, '@fox56wolftv', 'https://www.facebook.com/fox56wolftv', '@fox56wolftv', 1984, 'FOX affiliate. Studios in Plains Township. Operated by Sinclair under master service agreement. Part of New Age Media.'),

('WFMZ-TV (69 News)', 'https://www.wfmz.com/', 'tv_station', 'Maranatha Broadcasting Company', 'Maranatha Broadcasting Company', 'Continuous', 'free', NULL, '@69aborews', 'https://www.facebook.com/wfmz69news', NULL, 1976, 'Independent station. Locally owned since founding. Based in Allentown, serves Lehigh Valley, Berks County, Poconos. Family-oriented programming focus.'),

-- PUBLIC MEDIA

('WVIA-TV/FM', 'https://www.wvia.org/', 'public_media', 'Northeast Pennsylvania Educational Television Association', NULL, 'Continuous', 'free', NULL, '@WVIAPublicMedia', 'https://www.facebook.com/wviapublicmedia', NULL, 1966, 'PBS/NPR affiliate serving 22+ counties in NEPA. TV channel 44, FM 89.9. Studios in Jenkins Township. Mission: educate, inspire, entertain, foster citizenship.'),

('WLVT-TV (PBS 39)', 'https://www.wlvt.org/', 'public_media', 'Lehigh Valley Public Telecommunications Corporation', NULL, 'Continuous', 'free', NULL, NULL, NULL, NULL, NULL, 'PBS member station serving Lehigh Valley. Allentown-based.'),

-- RADIO STATIONS

('WILK Newsradio', 'https://www.audacy.com/wilknews', 'radio_station', 'Audacy Inc.', 'Audacy Inc.', 'Continuous', 'free', NULL, '@WILKNewsradio', NULL, NULL, 1947, 'News/Talk format. 980 AM, 103.1 FM, 910 AM simulcast. Studios in Pittston. Local weekday hosts. ABC News Radio. Penn State sports, WBS Penguins hockey.'),

('WARM 590 AM', NULL, 'radio_station', 'Seven Mountains Media', 'Seven Mountains Media (Southern Belle LLC)', 'Continuous', 'free', NULL, NULL, NULL, NULL, 1940, 'Sports format (current). Historic Top 40 powerhouse in 1960s-70s as "The Mighty 590." Licensed to Scranton.'),

-- NONPROFIT / INVESTIGATIVE

('Spotlight PA', 'https://www.spotlightpa.org/', 'nonprofit_news', 'Nonprofit 501c3', 'Spotlight PA', 'Continuous', 'free', NULL, '@SpotlightPA', 'https://www.facebook.com/SpotlightPA', '@spotlightpa', 2019, 'Statewide investigative nonprofit. Distributes to 100+ partner newsrooms. PA Post daily newsletter. Saved taxpayers $20M+, prompted 58 policy changes. State College regional bureau launched 2022.'),

('NEPA Media Group', 'https://nepamedia.net/', 'nonprofit_news', 'Nonprofit/Independent', NULL, 'Continuous', 'free', NULL, NULL, NULL, NULL, NULL, 'Privately owned independent media organization focused on local journalism, civic engagement, and public dialogue in NEPA.');

-- ============================================================================
-- SEED DATA: SOURCE COVERAGE MAPPING
-- ============================================================================

INSERT INTO `civiq_source_coverage` (`source_id`, `county`, `cities`, `is_primary`) VALUES
-- Times Leader
(1, 'Luzerne', '["Wilkes-Barre", "Pittston", "Nanticoke", "Hazleton", "Kingston", "Plains Township"]', TRUE),
-- Citizens Voice
(2, 'Luzerne', '["Wilkes-Barre", "Kingston", "Pittston", "Nanticoke", "Hazleton"]', TRUE),
-- Sunday Dispatch
(3, 'Luzerne', '["Pittston", "Dupont", "Avoca", "West Pittston"]', TRUE),
-- Abington Journal
(4, 'Lackawanna', '["Clarks Summit", "Dalton", "South Abington Township"]', TRUE),
-- Times-Tribune
(6, 'Lackawanna', '["Scranton", "Carbondale", "Dunmore", "Old Forge"]', TRUE),
(6, 'Luzerne', '["Wilkes-Barre", "Pittston"]', FALSE),
-- Go Lackawanna
(7, 'Lackawanna', '["Scranton", "Carbondale", "Dunmore"]', TRUE),
-- Pocono Record
(8, 'Monroe', '["Stroudsburg", "East Stroudsburg", "Mount Pocono", "Tobyhanna"]', TRUE),
(8, 'Pike', '["Milford", "Dingmans Ferry"]', FALSE),
(8, 'Wayne', '["Honesdale"]', FALSE),
-- Pocono Times
(9, 'Monroe', '["Stroudsburg", "East Stroudsburg", "Bushkill", "Effort"]', TRUE),
-- West End Reporter
(10, 'Monroe', '["Brodheadsville", "Gilbert", "Kunkletown"]', TRUE),
-- Morning Call
(12, 'Lehigh', '["Allentown", "Emmaus", "Whitehall", "Catasauqua"]', TRUE),
(12, 'Northampton', '["Bethlehem", "Easton", "Nazareth"]', TRUE),
(12, 'Monroe', '["Stroudsburg"]', FALSE),
-- Lehigh Valley Press
(13, 'Lehigh', '["Allentown", "Emmaus", "Catasauqua", "Whitehall"]', TRUE),
(13, 'Northampton', '["Bethlehem", "Northampton Borough"]', TRUE),
-- LehighValleyNews.com
(14, 'Lehigh', '["Allentown"]', TRUE),
(14, 'Northampton', '["Bethlehem", "Easton"]', TRUE),
-- Express-Times
(16, 'Northampton', '["Easton", "Bethlehem", "Nazareth", "Bangor"]', TRUE),
(16, 'Lehigh', '["Allentown"]', FALSE),
-- Standard-Speaker
(17, 'Luzerne', '["Hazleton", "Freeland", "McAdoo", "Weatherly"]', TRUE),
-- WNEP
(18, 'Luzerne', '["Wilkes-Barre", "Hazleton", "Pittston"]', TRUE),
(18, 'Lackawanna', '["Scranton", "Carbondale"]', TRUE),
(18, 'Monroe', '["Stroudsburg"]', FALSE),
-- WBRE/WYOU
(19, 'Luzerne', '["Wilkes-Barre"]', TRUE),
(19, 'Lackawanna', '["Scranton"]', TRUE),
(20, 'Luzerne', '["Wilkes-Barre"]', TRUE),
(20, 'Lackawanna', '["Scranton"]', TRUE),
-- WOLF-TV
(21, 'Luzerne', '["Plains Township", "Wilkes-Barre"]', TRUE),
(21, 'Lackawanna', '["Scranton"]', TRUE),
-- WFMZ
(22, 'Lehigh', '["Allentown"]', TRUE),
(22, 'Northampton', '["Bethlehem", "Easton"]', TRUE),
(22, 'Monroe', '["Stroudsburg"]', FALSE),
-- WVIA
(23, 'Luzerne', '["Jenkins Township", "Pittston", "Wilkes-Barre"]', TRUE),
(23, 'Lackawanna', '["Scranton"]', TRUE),
-- WILK
(25, 'Luzerne', '["Pittston", "Wilkes-Barre"]', TRUE),
(25, 'Lackawanna', '["Scranton"]', TRUE);

-- ============================================================================
-- SEED DATA: GOVERNMENT SOURCES
-- ============================================================================

INSERT INTO `civiq_government_sources`
(`name`, `url`, `type`, `jurisdiction`, `county`, `has_agenda_portal`, `has_meeting_videos`, `has_open_records`, `meeting_schedule`, `notes`)
VALUES

-- LUZERNE COUNTY (Primary Pilot)
('Luzerne County Government', 'https://www.luzernecounty.org/', 'county', 'Luzerne County', 'Luzerne', TRUE, TRUE, TRUE, 'County Council meetings - check agenda center', 'Open Government Portal available. Meeting archives back to 2012. Zoom available for virtual attendance.'),

('Luzerne County Council', 'https://www.luzernecounty.org/437/County-Council', 'county', 'Luzerne County Council', 'Luzerne', TRUE, TRUE, TRUE, 'Regular meetings in Council Meeting Room, Courthouse', 'Agendas posted prior to meetings. Audio/video archives. Minutes upon approval.'),

('City of Wilkes-Barre', 'https://www.wilkes-barre.city/', 'city', 'City of Wilkes-Barre', 'Luzerne', TRUE, FALSE, TRUE, 'Work and Regular Sessions at 6:00 PM, City Hall 4th Floor', 'County seat. Agenda archives available by year.'),

('Wilkes-Barre Area School District', 'https://www.wbasd.k12.pa.us/BoardofEducation.aspx', 'school_board', 'Wilkes-Barre Area SD', 'Luzerne', TRUE, TRUE, TRUE, 'Committee 5:00 PM, Regular 6:30 PM at WBA High School', 'Live-streamed meetings. 9 board members, 4-year terms.'),

-- LACKAWANNA COUNTY
('Lackawanna County Government', 'https://www.lackawannacounty.org/', 'county', 'Lackawanna County', 'Lackawanna', TRUE, FALSE, TRUE, '1st and 3rd Wednesday at 10am, 5th Floor 123 Wyoming Ave', 'Three commissioners (Board of Commissioners). Home Rule Charter since 1976.'),

('City of Scranton', 'https://scrantonpa.gov/', 'city', 'City of Scranton', 'Lackawanna', TRUE, TRUE, TRUE, 'Tuesdays 6:30 PM, caucus 5:45 PM', 'ECTV YouTube livestream. Granicus meeting archives. 24-hour agenda posting required.'),

('Scranton School District', 'https://www.scrsd.org/', 'school_board', 'Scranton School District', 'Lackawanna', TRUE, FALSE, TRUE, 'Check website for schedule', '9 board members, 4-year terms. 15 schools.'),

-- MONROE COUNTY
('Monroe County Government', 'https://www.monroecountypa.gov/', 'county', 'Monroe County', 'Monroe', TRUE, TRUE, TRUE, '1st and 3rd Wednesday at 9:30 AM, Admin Center', 'Public workshop Mondays at 10 AM. Virtual via Microsoft Teams available.'),

-- NORTHAMPTON COUNTY
('Northampton County Government', 'https://www.northamptoncounty.org/', 'county', 'Northampton County', 'Northampton', TRUE, TRUE, TRUE, '1st and 3rd Thursday', 'Home Rule Charter since 1978. 9-member council. County Executive form of government.'),

('Northampton County Council', 'https://norcopa.gov/county-council', 'county', 'Northampton County Council', 'Northampton', TRUE, TRUE, TRUE, '1st and 3rd Thursday', '5 at-large members, 4 district members. Government Center at 669 Washington St, Easton.'),

-- LEHIGH COUNTY
('Lehigh County Government', 'https://www.lehighcounty.org/', 'county', 'Lehigh County', 'Lehigh', TRUE, FALSE, TRUE, 'Check website', 'Home Rule Charter. 9 commissioners (4 at-large, 5 district). County Executive.'),

('City of Allentown', 'https://www.allentownpa.gov/', 'city', 'City of Allentown', 'Lehigh', TRUE, FALSE, TRUE, 'Check website', 'County seat. Largest city in Lehigh Valley.'),

-- STATE GOVERNMENT SOURCES
('Pennsylvania Open Data Portal', 'https://data.pa.gov/', 'open_data_portal', 'Commonwealth of Pennsylvania', NULL, FALSE, FALSE, TRUE, NULL, 'OpenDataPA launched 2016. Central repository for state agency data. Free and accessible format.'),

('Pennsylvania General Assembly', 'https://www.palegis.us/', 'state_legislature', 'PA General Assembly', NULL, TRUE, TRUE, TRUE, 'House and Senate session days', 'Bill history back to 1969. Voting records. PaLegis Notifications for email updates. Data downloads available.'),

('PA General Assembly (Legacy)', 'https://www.legis.state.pa.us/', 'state_legislature', 'PA General Assembly', NULL, TRUE, TRUE, TRUE, NULL, 'Legacy website. Bill text, amendments, statutes.'),

('PA Legislative Data Processing Center', 'https://www.paldpc.us/', 'state_legislature', 'LDPC', NULL, FALSE, FALSE, TRUE, NULL, 'Service agency of General Assembly. Computer systems for legislative information. Created 1968.'),

('PA Unified Judicial System', 'https://www.pacourts.us/', 'state_courts', 'PA Courts', NULL, TRUE, FALSE, TRUE, NULL, 'Public records, docket sheets. UJS Web Portal at ujsportal.pacourts.us. PAeDocket mobile app.'),

('UJS Portal - Case Search', 'https://ujsportal.pacourts.us/CaseSearch', 'state_courts', 'PA Courts', NULL, FALSE, FALSE, TRUE, NULL, 'Free search of court cases and docket sheets. Appellate, Common Pleas, Magisterial District courts.'),

('PA Treasury Transparency Portal', 'https://www.patreasury.gov/transparency/', 'state_agency', 'PA Treasury', NULL, FALSE, FALSE, TRUE, NULL, 'Real-time general fund balance. 3 years of expenditure comparison. Fund, department, appropriation levels.');

-- ============================================================================
-- SEED DATA: RSS FEEDS
-- ============================================================================

INSERT INTO `civiq_rss_feeds` (`source_id`, `feed_url`, `feed_name`, `category`) VALUES
-- Morning Call feeds
(12, 'https://www.mcall.com/latest-headlines/feed/', 'Latest Headlines', 'breaking'),
(12, 'https://www.mcall.com/local-news/feed/', 'Local News', 'local'),
-- WBRE/WYOU feeds
(19, 'https://www.pahomepage.com/feed/', 'Main Feed', 'news'),
(20, 'https://www.pahomepage.com/feed/', 'Main Feed', 'news'),
-- Times-Tribune
(6, 'https://www.thetimes-tribune.com/feed/', 'Main Feed', 'news');

-- ============================================================================
-- VIEW: Combined source summary for CIVIQ dashboard
-- ============================================================================

CREATE OR REPLACE VIEW `civiq_sources_summary` AS
SELECT
  s.id,
  s.name,
  s.url,
  s.type,
  s.ownership,
  s.parent_company,
  s.paywall_status,
  s.twitter_handle,
  GROUP_CONCAT(DISTINCT c.county ORDER BY c.is_primary DESC SEPARATOR ', ') as counties_covered,
  (SELECT COUNT(*) FROM civiq_rss_feeds f WHERE f.source_id = s.id AND f.active = 1) as rss_feed_count,
  s.active
FROM civiq_news_sources s
LEFT JOIN civiq_source_coverage c ON s.id = c.source_id
WHERE s.active = 1
GROUP BY s.id
ORDER BY
  FIELD(s.type, 'newspaper_daily', 'newspaper_weekly', 'tv_station', 'radio_station', 'online_only', 'nonprofit_news', 'public_media'),
  s.name;
