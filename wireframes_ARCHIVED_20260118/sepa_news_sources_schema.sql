-- Southeastern Pennsylvania News Sources Database Schema
-- Generated: 2026-01-04
-- For use with: lom1ubvhoxxi_sud_claude database
-- Table prefix: civiq_

-- ============================================
-- CORE TABLES
-- ============================================

-- News Sources (newspapers, online outlets)
CREATE TABLE IF NOT EXISTS civiq_news_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    source_type ENUM('newspaper', 'online_only', 'public_media', 'magazine') NOT NULL,
    format ENUM('daily', 'weekly', 'digital', 'print_and_digital', 'radio_tv_digital') DEFAULT 'digital',
    publication_frequency VARCHAR(100),
    paywall_status ENUM('free', 'metered', 'hard_paywall') DEFAULT 'free',
    owner_id VARCHAR(50),
    parent_company VARCHAR(255),
    ultimate_owner VARCHAR(255),
    ownership_notes TEXT,
    founded_year INT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coverage Areas (many-to-many relationship)
CREATE TABLE IF NOT EXISTS civiq_coverage_areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL,
    county VARCHAR(100) NOT NULL,
    coverage_notes VARCHAR(255),
    FOREIGN KEY (source_id) REFERENCES civiq_news_sources(id) ON DELETE CASCADE,
    INDEX idx_source (source_id),
    INDEX idx_county (county)
);

-- RSS Feeds
CREATE TABLE IF NOT EXISTS civiq_rss_feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) DEFAULT 'all',
    feed_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_checked TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES civiq_news_sources(id) ON DELETE CASCADE,
    INDEX idx_source (source_id)
);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS civiq_social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL,
    platform ENUM('twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok') NOT NULL,
    handle VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    FOREIGN KEY (source_id) REFERENCES civiq_news_sources(id) ON DELETE CASCADE,
    INDEX idx_source (source_id),
    INDEX idx_platform (platform)
);

-- Government Sources Referenced
CREATE TABLE IF NOT EXISTS civiq_government_refs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL,
    government_entity VARCHAR(255) NOT NULL,
    FOREIGN KEY (source_id) REFERENCES civiq_news_sources(id) ON DELETE CASCADE,
    INDEX idx_source (source_id)
);

-- TV Stations
CREATE TABLE IF NOT EXISTS civiq_tv_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    call_sign VARCHAR(10),
    channel_number INT,
    url VARCHAR(500),
    network ENUM('ABC', 'CBS', 'NBC', 'FOX', 'PBS', 'CW', 'Independent', 'Telemundo', 'Univision') NOT NULL,
    parent_company VARCHAR(255),
    ultimate_owner VARCHAR(255),
    ownership_notes TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TV Station Coverage
CREATE TABLE IF NOT EXISTS civiq_tv_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    market VARCHAR(100) NOT NULL,
    FOREIGN KEY (station_id) REFERENCES civiq_tv_stations(id) ON DELETE CASCADE,
    INDEX idx_station (station_id)
);

-- TV Station Social Media
CREATE TABLE IF NOT EXISTS civiq_tv_social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    platform ENUM('twitter', 'facebook', 'instagram', 'youtube') NOT NULL,
    handle VARCHAR(255) NOT NULL,
    FOREIGN KEY (station_id) REFERENCES civiq_tv_stations(id) ON DELETE CASCADE,
    INDEX idx_station (station_id)
);

-- Radio Stations
CREATE TABLE IF NOT EXISTS civiq_radio_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    call_sign VARCHAR(10),
    frequency VARCHAR(20),
    url VARCHAR(500),
    format ENUM('all_news', 'public_radio', 'talk', 'music', 'sports') NOT NULL,
    parent_company VARCHAR(255),
    ultimate_owner VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Government Sources (official websites)
CREATE TABLE IF NOT EXISTS civiq_government_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    gov_type ENUM('municipal', 'county', 'state', 'federal', 'school_district', 'special_district') NOT NULL,
    coverage_area VARCHAR(255),
    council_url VARCHAR(500),
    legislation_url VARCHAR(500),
    mayor_exec_url VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Civic Data Sources
CREATE TABLE IF NOT EXISTS civiq_data_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source_type ENUM('data_portal', 'planning_agency', 'research', 'nonprofit') NOT NULL,
    coverage_area VARCHAR(255),
    description TEXT,
    data_types TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Aggregators
CREATE TABLE IF NOT EXISTS civiq_aggregators (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    parent_company VARCHAR(255),
    ultimate_owner VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aggregator Local Sites
CREATE TABLE IF NOT EXISTS civiq_aggregator_sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aggregator_id VARCHAR(50) NOT NULL,
    site_url VARCHAR(500) NOT NULL,
    coverage_area VARCHAR(255),
    FOREIGN KEY (aggregator_id) REFERENCES civiq_aggregators(id) ON DELETE CASCADE,
    INDEX idx_aggregator (aggregator_id)
);

-- Ownership Groups
CREATE TABLE IF NOT EXISTS civiq_ownership_groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    org_type ENUM('public_company', 'private_company', 'hedge_fund', 'nonprofit', 'family_owned') NOT NULL,
    subsidiaries TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA: NEWS SOURCES
-- ============================================

INSERT INTO civiq_news_sources (id, name, url, source_type, format, publication_frequency, paywall_status, parent_company, ultimate_owner, ownership_notes, notes) VALUES
('philadelphia_inquirer', 'The Philadelphia Inquirer', 'https://www.inquirer.com', 'newspaper', 'daily', 'daily', 'metered', 'The Philadelphia Inquirer, LLC', 'Lenfest Institute for Journalism (nonprofit)', 'Owned by The Philadelphia Foundation, a nonprofit organization', 'Largest newspaper in PA, Daily News merged into Inquirer in 2019'),
('philadelphia_tribune', 'The Philadelphia Tribune', 'https://www.phillytrib.com', 'newspaper', 'print_and_digital', '5 days per week', 'free', 'Philadelphia Tribune Company', 'Independent (Robert W. Bogle, President)', 'Oldest continually publishing African-American newspaper in the US, founded 1884', 'Founded by Christopher James Perry Sr. in 1884'),
('philly_voice', 'PhillyVoice', 'https://www.phillyvoice.com', 'online_only', 'digital', 'continuous', 'free', 'Vocal Media', 'Vocal Media', 'Digital media publisher', 'Digital-first news publication covering Philadelphia region'),
('billy_penn', 'Billy Penn', 'https://billypenn.com', 'online_only', 'digital', 'continuous', 'free', 'WHYY', 'WHYY (public media)', 'Reader-powered nonprofit newsroom', 'Original local reporting with daily newsletter'),
('whyy', 'WHYY', 'https://whyy.org', 'public_media', 'radio_tv_digital', 'continuous', 'free', 'WHYY Inc.', 'Nonprofit public media', 'Leading public media organization in Philadelphia region', 'NPR/PBS affiliate serving tri-state area'),
('bucks_county_courier_times', 'Bucks County Courier Times', 'https://www.buckscountycouriertimes.com', 'newspaper', 'daily', 'daily (no Monday print)', 'metered', 'Gannett', 'Gannett Co. Inc.', 'Sold by Calkins Media in 2017; 75%+ staff cuts since sale', 'Serves lower and central Bucks County'),
('the_intelligencer', 'The Intelligencer', 'https://www.theintell.com', 'newspaper', 'daily', '6 days/week', 'metered', 'Gannett', 'Gannett Co. Inc.', 'Previously owned by Calkins Media, sold 2017', 'Serves central and upper Bucks County, based in Langhorne'),
('bucks_county_herald', 'Bucks County Herald', 'https://www.buckscountyherald.com', 'newspaper', 'weekly', 'weekly', 'free', 'Independent', 'Locally owned', 'Independent community newspaper', 'Community newspaper covering Bucks County'),
('levittown_now', 'LevittownNow.com', 'https://levittownnow.com', 'online_only', 'digital', 'continuous', 'free', 'Independent', 'Locally owned', 'Founded 2013, hyperlocal digital news', 'Reaches 82% of adults in coverage area; highest reach in Bucks County'),
('bucksco_today', 'BUCKSCO Today', 'https://bucksco.today', 'online_only', 'digital', 'continuous', 'free', 'American Community Journals', 'American Community Journals (Ken Knickerbocker)', 'Part of ACJ network, launched 2020', 'Focuses on positive, upbeat local news'),
('times_herald', 'The Times Herald', 'https://www.timesherald.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital', '13th oldest newspaper in the nation, sold to Journal Register Co. in 1993', 'Based in Norristown, PA'),
('montco_today', 'MONTCO Today', 'https://montco.today', 'online_only', 'digital', 'continuous', 'free', 'American Community Journals', 'American Community Journals (Ken Knickerbocker)', 'Part of ACJ network, launched 2016', 'Positive local news focus'),
('pottstown_mercury', 'The Pottstown Mercury', 'https://www.pottsmerc.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital', 'Two Pulitzer Prize winners on staff', 'Daily circulation of 27,500'),
('main_line_media_news', 'Main Line Media News', 'https://www.mainlinemedianews.com', 'newspaper', 'weekly', 'weekly', 'free', 'Digital First Media', 'Alden Global Capital', 'Includes Main Line Times, Suburban Life, King of Prussia Courier', 'Serves Bala Cynwyd to Malvern corridor'),
('delaware_county_daily_times', 'Delaware County Daily Times', 'https://www.delcotimes.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital (via Digital First Media)', 'Founded 1876, only PA newspaper branded with county name', 'Largest circulation suburban paper in Philadelphia area'),
('delco_today', 'DELCO Today', 'https://delco.today', 'online_only', 'digital', 'continuous', 'free', 'American Community Journals', 'American Community Journals (Ken Knickerbocker)', 'Part of ACJ network, launched 2016', 'Positive community news focus'),
('daily_local_news', 'Daily Local News', 'https://www.dailylocal.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital', 'Based in West Chester', 'Primary newspaper for Chester County'),
('vista_today', 'VISTA Today', 'https://vista.today', 'online_only', 'digital', 'continuous', 'free', 'American Community Journals', 'American Community Journals (Ken Knickerbocker)', 'First ACJ publication, launched 2014', 'Covers West Chester, Coatesville, Phoenixville, Kennett Square'),
('chester_county_press', 'Chester County Press', 'https://www.chestercounty.com', 'newspaper', 'weekly', 'weekly', 'free', 'Ad Pro Inc.', 'Locally owned', 'Founded 1866, oldest weekly in Chester County', 'Based in Oxford, serves Kennett Square, West Grove, Avondale'),
('mychesco', 'MyChesCo', 'https://www.mychesco.com', 'online_only', 'digital', 'continuous', 'free', 'Independent', 'Locally owned', 'Community news website', 'Daily local news and community website'),
('reading_eagle', 'Reading Eagle', 'https://www.readingeagle.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital', 'Founded 1867, sold after bankruptcy in 2019 after 150+ years family ownership', 'Primary newspaper for Berks County/Reading area'),
('berks_weekly', 'Berks Weekly', 'https://berksweekly.com', 'online_only', 'digital', 'continuous', 'free', 'Independent', 'Locally owned', 'Independent digital news outlet', 'Also has mobile app and new monthly print edition'),
('lnp_lancaster_online', 'LNP | LancasterOnline', 'https://lancasteronline.com', 'newspaper', 'daily', 'daily (7 days)', 'metered', 'Always Lancaster (nonprofit)', 'Always Lancaster (David Greene, CEO)', 'Transferred from Pennon/WITF in Dec 2025; formerly Steinman Communications', 'Staff unionized Feb 2025; nonprofit ownership as of Dec 2025'),
('york_daily_record', 'York Daily Record', 'https://www.ydr.com', 'newspaper', 'daily', 'daily', 'metered', 'Gannett', 'Gannett Co. Inc.', 'Acquired by Gannett 2015; merging with York Dispatch in 2026', 'Primary newspaper for York County'),
('york_dispatch', 'The York Dispatch', 'https://www.yorkdispatch.com', 'newspaper', 'daily', 'weekdays', 'metered', 'Gannett', 'Gannett Co. Inc.', 'Founded 1876; oldest newspaper in York County; merging with YDR in 2026', 'Operating under joint agreement with YDR since 1990'),
('republican_herald', 'Republican Herald', 'https://www.republicanherald.com', 'newspaper', 'daily', 'daily', 'metered', 'MediaNews Group', 'Alden Global Capital', 'Founded 1884', 'Based in Pottsville, serves Coal Region'),
('times_news_carbon', 'Times News', 'https://www.tnonline.com', 'newspaper', 'daily', 'daily', 'metered', 'Times News Media Group LLC', 'Pencor Services', 'Long history of mergers and name changes', 'Based in Lehighton, serves Jim Thorpe area'),
('morning_call', 'The Morning Call', 'https://www.mcall.com', 'newspaper', 'daily', 'daily', 'metered', 'Tribune Publishing', 'Alden Global Capital', 'Founded 1883; acquired by Alden May 2021', 'Lehigh Valley primary newspaper; moved content behind paywall 2024'),
('express_times', 'The Express-Times', 'https://www.lehighvalleylive.com', 'online_only', 'digital', 'continuous', 'free', 'Advance Local', 'Advance Publications (Newhouse family)', 'Print edition ended February 2025 after 170 years', 'Now digital-only at lehighvalleylive.com'),
('lehigh_valley_news', 'LehighValleyNews.com', 'https://www.lehighvalleynews.com', 'online_only', 'digital', 'continuous', 'free', 'Independent', 'Locally owned', 'Digital news site', 'Hyperlocal coverage for Allentown, Bethlehem, Easton'),
('philadelphia_business_journal', 'Philadelphia Business Journal', 'https://www.bizjournals.com/philadelphia', 'newspaper', 'weekly', 'weekly print, daily online', 'metered', 'American City Business Journals', 'Advance Publications', 'Part of 44-market Business Journals network', 'Business-focused coverage'),
('al_dia', 'AL DIA News', 'https://www.aldianews.com', 'newspaper', 'print_and_digital', 'weekly print, daily online', 'free', 'AL DIA News Media', 'Hernan Guaracao (founder)', 'Founded 1992 by Colombian immigrants', 'Spanish and English language; 100,000 print readership; launched AL DIA Magazine 2023'),
('south_philly_review', 'South Philly Review', 'https://southphillyreview.com', 'newspaper', 'weekly', 'weekly (Thursday)', 'free', 'Newspaper Media Group', 'Richard Donnelly', 'Founded 1948; sold to Broad Street Media 2015, then to Donnelly 2016', 'Reaches 62,000 homes door-to-door'),
('philadelphia_weekly', 'Philadelphia Weekly', 'https://philadelphiaweekly.com', 'online_only', 'digital', 'continuous', 'free', 'Paradise Media', 'Paradise Media (Puerto Rico)', 'Founded 1971 as The Welcomat; multiple ownership changes', 'Alternative weekly; previously attempted conservative pivot in 2020'),
('spotlight_pa', 'Spotlight PA', 'https://www.spotlightpa.org', 'online_only', 'digital', 'continuous', 'free', 'Spotlight PA Inc.', 'Nonprofit 501(c)(3)', 'Founded 2019 by Lenfest Institute; fully independent since Aug 2023', 'Investigative journalism; content shared with 100+ PA newsrooms; Gerald Loeb Award winner');

-- ============================================
-- SEED DATA: COVERAGE AREAS
-- ============================================

INSERT INTO civiq_coverage_areas (source_id, county) VALUES
('philadelphia_inquirer', 'Philadelphia County'),
('philadelphia_inquirer', 'Bucks County'),
('philadelphia_inquirer', 'Montgomery County'),
('philadelphia_inquirer', 'Delaware County'),
('philadelphia_inquirer', 'Chester County'),
('philadelphia_tribune', 'Philadelphia County'),
('philadelphia_tribune', 'Delaware County'),
('philadelphia_tribune', 'Montgomery County'),
('philly_voice', 'Philadelphia County'),
('billy_penn', 'Philadelphia County'),
('whyy', 'Philadelphia County'),
('whyy', 'Delaware State'),
('bucks_county_courier_times', 'Bucks County'),
('the_intelligencer', 'Bucks County'),
('the_intelligencer', 'Montgomery County'),
('bucks_county_herald', 'Bucks County'),
('levittown_now', 'Bucks County'),
('bucksco_today', 'Bucks County'),
('times_herald', 'Montgomery County'),
('montco_today', 'Montgomery County'),
('pottstown_mercury', 'Montgomery County'),
('pottstown_mercury', 'Berks County'),
('pottstown_mercury', 'Chester County'),
('main_line_media_news', 'Montgomery County'),
('main_line_media_news', 'Delaware County'),
('delaware_county_daily_times', 'Delaware County'),
('delco_today', 'Delaware County'),
('daily_local_news', 'Chester County'),
('daily_local_news', 'Lancaster County'),
('daily_local_news', 'Delaware County'),
('vista_today', 'Chester County'),
('chester_county_press', 'Chester County'),
('mychesco', 'Chester County'),
('reading_eagle', 'Berks County'),
('berks_weekly', 'Berks County'),
('lnp_lancaster_online', 'Lancaster County'),
('york_daily_record', 'York County'),
('york_dispatch', 'York County'),
('republican_herald', 'Schuylkill County'),
('republican_herald', 'Carbon County'),
('times_news_carbon', 'Carbon County'),
('morning_call', 'Lehigh County'),
('morning_call', 'Northampton County'),
('morning_call', 'Carbon County'),
('morning_call', 'Berks County'),
('express_times', 'Northampton County'),
('express_times', 'Lehigh County'),
('lehigh_valley_news', 'Lehigh County'),
('lehigh_valley_news', 'Northampton County'),
('philadelphia_business_journal', 'Philadelphia County'),
('philadelphia_business_journal', 'Bucks County'),
('philadelphia_business_journal', 'Montgomery County'),
('philadelphia_business_journal', 'Delaware County'),
('philadelphia_business_journal', 'Chester County'),
('al_dia', 'Philadelphia County'),
('south_philly_review', 'Philadelphia County'),
('philadelphia_weekly', 'Philadelphia County'),
('spotlight_pa', 'Pennsylvania Statewide');

-- ============================================
-- SEED DATA: RSS FEEDS
-- ============================================

INSERT INTO civiq_rss_feeds (source_id, category, feed_url) VALUES
('philadelphia_inquirer', 'news', 'https://www.inquirer.com/arcio/rss/'),
('philadelphia_inquirer', 'sports', 'https://www.inquirer.com/arcio/rss/category/sports/'),
('philly_voice', 'all', 'https://www.phillyvoice.com/feed/'),
('billy_penn', 'all', 'https://billypenn.com/feed/'),
('whyy', 'news', 'https://whyy.org/feed/'),
('levittown_now', 'all', 'https://levittownnow.com/feed/'),
('lnp_lancaster_online', 'news', 'https://lancasteronline.com/search/?f=rss'),
('express_times', 'news', 'https://www.lehighvalleylive.com/arc/outboundfeeds/rss/'),
('philadelphia_business_journal', 'news', 'https://www.bizjournals.com/philadelphia/feed/'),
('spotlight_pa', 'news', 'https://www.spotlightpa.org/feed.xml');

-- ============================================
-- SEED DATA: TV STATIONS
-- ============================================

INSERT INTO civiq_tv_stations (id, name, call_sign, channel_number, url, network, parent_company, ultimate_owner, notes) VALUES
('wpvi_6abc', 'WPVI-TV 6ABC Action News', 'WPVI', 6, 'https://6abc.com', 'ABC', 'ABC Owned Television Stations', 'The Walt Disney Company', 'ABC owned-and-operated station'),
('kyw_cbs3', 'KYW-TV CBS3 Philadelphia', 'KYW', 3, 'https://www.cbsnews.com/philadelphia/', 'CBS', 'CBS News and Stations', 'Paramount Global', 'Pennsylvania oldest TV station'),
('wcau_nbc10', 'WCAU NBC10 Philadelphia', 'WCAU', 10, 'https://www.nbcphiladelphia.com', 'NBC', 'NBC Owned Television Stations', 'NBCUniversal (Comcast)', 'Sister station to Telemundo 62'),
('wtxf_fox29', 'WTXF-TV Fox 29 Philadelphia', 'WTXF', 29, 'https://www.fox29.com', 'FOX', 'Fox Television Stations', 'Fox Corporation', 'Fox owned-and-operated since 1995'),
('wfmz_69', 'WFMZ-TV 69 News', 'WFMZ', 69, 'https://www.wfmz.com', 'Independent', 'Maranatha Broadcasting Company', 'Maranatha Broadcasting (locally owned)', 'Founded 1976 by Dick Dean; secondary studio in Reading'),
('wwsi_telemundo62', 'WWSI Telemundo 62', 'WWSI', 62, 'https://www.telemundo62.com', 'Telemundo', 'Telemundo Station Group', 'NBCUniversal (Comcast)', 'Spanish-language news; shares studios with NBC10'),
('wuvp_univision65', 'WUVP-DT Univision 65', 'WUVP', 65, 'https://www.univision.com/local/filadelfia-wuvp', 'Univision', 'TelevisaUnivision', 'TelevisaUnivision', 'Leading Spanish-language destination in Philadelphia');

-- ============================================
-- SEED DATA: RADIO STATIONS
-- ============================================

INSERT INTO civiq_radio_stations (id, name, call_sign, frequency, url, format, parent_company, ultimate_owner, notes) VALUES
('kyw_newsradio', 'KYW Newsradio 1060', 'KYW', '1060 AM / 103.9 FM', 'https://www.audacy.com/kywnewsradio', 'all_news', 'Audacy Inc.', 'Audacy Inc.', 'Flagship station of Audacy; 50,000 watt clear channel; simulcasts on FM since Nov 2020'),
('whyy_fm', 'WHYY-FM 90.9', 'WHYY-FM', '90.9 FM', 'https://whyy.org', 'public_radio', 'WHYY Inc.', 'Nonprofit public media', 'NPR member station; NPR and BBC programming');

-- ============================================
-- SEED DATA: GOVERNMENT SOURCES
-- ============================================

INSERT INTO civiq_government_sources (id, name, url, gov_type, coverage_area, council_url, legislation_url, notes) VALUES
('philadelphia_city', 'City of Philadelphia', 'https://www.phila.gov', 'municipal', 'Philadelphia County', 'https://phlcouncil.com', 'https://phila.legistar.com', 'Consolidated city-county government'),
('philadelphia_school_district', 'School District of Philadelphia', 'https://www.philasd.org', 'school_district', 'Philadelphia County', 'https://www.philasd.org/schoolboard/', NULL, '9-member appointed board; re-established 2018'),
('bucks_county_gov', 'Bucks County Government', 'https://www.buckscounty.gov', 'county', 'Bucks County', 'https://www.buckscounty.gov/27/Government', NULL, '3-member Board of Commissioners; county seat in Doylestown'),
('montgomery_county_gov', 'Montgomery County Government', 'https://www.montgomerycountypa.gov', 'county', 'Montgomery County', 'https://www.montgomerycountypa.gov/130/Commissioners', NULL, 'Engage Montco civic engagement platform available'),
('delaware_county_gov', 'Delaware County Government', 'https://delcopa.gov', 'county', 'Delaware County', 'https://www.delcopa.gov/council', NULL, 'Home Rule Charter; county seat in Media'),
('chester_county_gov', 'Chester County Government', 'https://www.chesco.org', 'county', 'Chester County', 'https://www.chesco.org/3205/Government', NULL, '3rd Class County; 3-member Board of Commissioners'),
('berks_county_gov', 'Berks County Government', 'https://www.berkspa.gov', 'county', 'Berks County', 'https://www.berkspa.gov/about-us', NULL, 'County seat in Reading'),
('lancaster_county_gov', 'Lancaster County Government', 'https://co.lancaster.pa.us', 'county', 'Lancaster County', 'https://co.lancaster.pa.us/150/Commissioners', NULL, 'Government Center at 150 N Queen St, Lancaster'),
('york_county_gov', 'York County Government', 'https://www.yorkcountypa.gov', 'county', 'York County', 'https://www.yorkcountypa.gov/county-government/board-of-commissioners.html', NULL, 'Property tax refund program for firefighters/EMS'),
('carbon_county_gov', 'Carbon County Government', 'https://www.carboncountypa.gov', 'county', 'Carbon County', 'https://www.carboncountypa.gov/community/', NULL, 'County seat in Jim Thorpe; population 64,749'),
('schuylkill_county_gov', 'Schuylkill County Government', 'https://www.co.schuylkill.pa.us', 'county', 'Schuylkill County', 'https://schuylkillcountypa.gov/government/commissioners/', NULL, 'County seat in Pottsville; population 143,049');

-- ============================================
-- SEED DATA: CIVIC DATA SOURCES
-- ============================================

INSERT INTO civiq_data_sources (id, name, url, source_type, coverage_area, description, data_types) VALUES
('open_data_philly', 'OpenDataPhilly', 'https://opendataphilly.org', 'data_portal', 'Philadelphia region', 'Official open data repository for City of Philadelphia plus regional data', '311 requests, property assessments, language access services, GIS data'),
('pa_open_data', 'OpenDataPA', 'https://data.pa.gov', 'data_portal', 'Pennsylvania statewide', 'Pennsylvania state government open data portal', 'job creation, school performance, bridge repairs, state agency data'),
('penndot_open_data', 'PennDOT Open Data', 'https://data-pennshare.opendata.arcgis.com', 'data_portal', 'Pennsylvania statewide', 'Transportation-related data from PennDOT', 'road conditions, traffic, construction projects'),
('dvrpc', 'Delaware Valley Regional Planning Commission', 'https://www.dvrpc.org', 'planning_agency', 'Bucks, Chester, Delaware, Montgomery, Philadelphia, Burlington NJ, Camden NJ, Gloucester NJ, Mercer NJ', 'Metropolitan Planning Organization for 9-county region', 'transportation planning, regional data, economic development');

-- ============================================
-- SEED DATA: AGGREGATORS
-- ============================================

INSERT INTO civiq_aggregators (id, name, url, parent_company, ultimate_owner, notes) VALUES
('patch_network', 'Patch', 'https://patch.com', 'Patch Media', 'Hale Global', 'Network of hyperlocal community sites'),
('tapinto', 'TAPinto', 'https://www.tapinto.net', 'TAPinto Inc.', 'Independently owned franchises', 'Network of 95+ local news platforms; launched Doylestown site 2022'),
('acj_network', 'American Community Journals', 'https://acj.today', 'American Community Journals', 'Ken Knickerbocker', 'Founded 2014; focuses on positive local news');

-- ============================================
-- SEED DATA: OWNERSHIP GROUPS
-- ============================================

INSERT INTO civiq_ownership_groups (id, name, org_type, subsidiaries, notes) VALUES
('gannett', 'Gannett Co. Inc.', 'public_company', 'USA Today Network', 'Largest US newspaper publisher; formed from GateHouse-Gannett merger 2019'),
('alden_global_capital', 'Alden Global Capital', 'hedge_fund', 'MediaNews Group, Tribune Publishing', 'Known for aggressive cost-cutting at acquired papers'),
('advance_publications', 'Advance Publications', 'private_company', 'Advance Local, American City Business Journals', 'Owned by Newhouse family'),
('lenfest_institute', 'Lenfest Institute for Journalism', 'nonprofit', NULL, 'Nonprofit owner supporting local journalism'),
('american_community_journals', 'American Community Journals', 'private_company', 'VISTA Today, MONTCO Today, DELCO Today, BUCKSCO Today, PHILADELPHIA Today', 'Founded by Ken Knickerbocker; positive news focus');
