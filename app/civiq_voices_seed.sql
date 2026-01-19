-- CIVIQ Voices Seed Data for Eastern PA
-- Officials and Media Sources from Luzerne, Lackawanna, Monroe, Lehigh, Northampton Counties

-- First, create user records for the voices
-- County IDs: Luzerne=1, Lackawanna=2, Monroe=3, Lehigh=4, Northampton=5

-- =============================================================
-- ELECTED OFFICIALS (8 entries)
-- =============================================================

-- 1. State Rep. Eddie Day Pashinski (D) - Luzerne County - District 121
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('pashinski_eddie_official', 256), 'rep.pashinski@pahouse.net', 'rep_pashinski', 'Rep. Eddie Day Pashinski',
'Pennsylvania State Representative serving the 121st District (Wilkes-Barre). Now in my ninth term, I fight for education funding, property tax relief, and economic development in Luzerne County.',
'18702', 'PA', 'Wilkes-Barre', 1, '121', 1, 3, 1);

SET @pashinski_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@pashinski_id, 'Fighting for Wilkes-Barre families since 2006',
'["education", "property_tax", "economic_development", "senior_services", "agriculture"]',
'PA State Representative District 121 (2006-present). Vice Chair, House Agricultural & Rural Affairs Committee. Former teacher and businessman.',
'https://www.pahouse.com/Pashinski/', '@EddieDayPash', 8500, 156, 3200, 'influential', -0.65, 1);

-- 2. State Rep. Alec Ryncavage (R) - Luzerne County - District 119
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('ryncavage_alec_official', 256), 'aryncavage@pahousegop.com', 'rep_ryncavage', 'Rep. Alec Ryncavage',
'Pennsylvania State Representative for the 119th District serving Plymouth, Nanticoke, and surrounding Luzerne County communities. Focused on consumer protection and local government.',
'18651', 'PA', 'Plymouth', 1, '119', 1, 2, 1);

SET @ryncavage_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@ryncavage_id, 'Working for a stronger Northeast PA',
'["transportation", "finance", "consumer_protection", "gaming_oversight", "local_government"]',
'PA State Representative District 119. Member of Transportation, Finance, Consumer Protection, Gaming Oversight, and Local Government Committees.',
'https://repryncavage.com/', '@RepRyncavage', 4200, 89, 1450, 'established', 0.55, 1);

-- 3. State Rep. Bridget Kosierowski (D) - Lackawanna County - District 114
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('kosierowski_bridget_official', 256), 'bkosierowski@pahouse.net', 'rep_kosierowski', 'Rep. Bridget Kosierowski',
'Pennsylvania State Representative for the 114th District. First Democratic woman from Lackawanna County elected to the State House in over 55 years. Deputy Whip.',
'18411', 'PA', 'Clarks Summit', 2, '114', 1, 3, 1);

SET @kosierowski_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@kosierowski_id, 'Making history, delivering results',
'["healthcare", "aging_services", "appropriations", "insurance", "professional_licensure"]',
'PA State Representative District 114 (2019-present). Deputy Whip. Member of Appropriations, Health, Insurance, and Aging & Older Adult Services Committees. Former Registered Nurse.',
'https://www.pahouse.com/Kosierowski/', '@RepKosierowski', 9200, 203, 4100, 'influential', -0.70, 1);

-- 4. State Rep. Kyle Donahue (D) - Lackawanna County - District 113
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('donahue_kyle_official', 256), 'kdonahue@pahouse.net', 'rep_donahue', 'Rep. Kyle Donahue',
'Pennsylvania State Representative serving the 113th District in Scranton and Lackawanna County. Committed to workers rights, energy policy, and strengthening our communities.',
'18505', 'PA', 'Scranton', 2, '113', 1, 2, 1);

SET @donahue_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@donahue_id, 'Scranton born and raised, fighting for NEPA',
'["energy", "gaming_oversight", "judiciary", "labor", "local_government"]',
'PA State Representative District 113. Member of Energy, Gaming Oversight, Judiciary, Labor & Industry, and Local Government Committees.',
'https://www.pahouse.com/Donahue/', '@RepKyleDonahue', 5600, 112, 1890, 'established', -0.60, 1);

-- 5. State Rep. Maureen Madden (D) - Monroe County - District 115
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('madden_maureen_official', 256), 'mmadden@pahouse.net', 'rep_madden', 'Rep. Maureen Madden',
'Pennsylvania State Representative for the 115th District serving Monroe County and the Pocono region. Advocating for education, environmental protection, and tourism.',
'18360', 'PA', 'Stroudsburg', 3, '115', 1, 2, 1);

SET @madden_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@madden_id, 'Protecting the Poconos, empowering our communities',
'["education", "environment", "tourism", "gaming", "local_government"]',
'PA State Representative District 115. Member of Education, Environmental Resources, Gaming Oversight, and Tourism Committees.',
'https://www.pahouse.com/Madden/', '@RepMadden', 3800, 78, 980, 'established', -0.55, 1);

-- 6. State Rep. Zach Mako (R) - Lehigh/Northampton Counties - District 183
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, state_house_district, is_voice, voice_level, is_verified)
VALUES (SHA2('mako_zach_official', 256), 'zmako@pahousegop.com', 'rep_mako', 'Rep. Zach Mako',
'Pennsylvania State Representative for the 183rd District serving parts of Lehigh and Northampton counties. Focused on property tax reform, job creation, and infrastructure.',
'18067', 'PA', 'Northampton', 5, '183', 1, 3, 1);

SET @mako_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@mako_id, 'Common sense solutions for the Lehigh Valley',
'["appropriations", "finance", "veterans_affairs", "professional_licensure", "ethics"]',
'PA State Representative District 183 (2016-present). Republican Chair, Appropriations Subcommittee on Economic Impact & Infrastructure. Member of Ethics and Finance Committees.',
'https://repmako.com/', '@RepZachMako', 7100, 145, 2650, 'influential', 0.60, 1);

-- 7. Mayor Paige Cognetti (D) - Scranton
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('cognetti_paige_official', 256), 'mayor@scrantonpa.gov', 'mayor_cognetti', 'Mayor Paige Cognetti',
'Mayor of Scranton, Pennsylvania since 2020. Led Scranton out of 30 years of financial distress. 2025 recipient of Governor Shapiros Secretary Award for Municipal Excellence.',
'18503', 'PA', 'Scranton', 2, 1, 3, 1);

SET @cognetti_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@cognetti_id, 'Building a stronger Scranton, together',
'["municipal_finance", "economic_development", "urban_planning", "public_safety", "infrastructure"]',
'Mayor of Scranton (2020-present). Led city exit from Act 47 financial distress. Achieved first investment-grade bond rating since 2011. Former Treasury Department official.',
'https://www.scrantonpa.gov/', '@MayorCognetti', 15200, 287, 6800, 'premier', -0.50, 1);

-- 8. Mayor George Brown (D) - Wilkes-Barre
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('brown_george_official', 256), 'mayor@wilkes-barre.city', 'mayor_brown', 'Mayor George C. Brown',
'Mayor of Wilkes-Barre, Pennsylvania. Working to revitalize downtown, improve public safety, and foster regional cooperation among NEPA municipalities.',
'18701', 'PA', 'Wilkes-Barre', 1, 1, 3, 1);

SET @brown_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_official)
VALUES (@brown_id, 'Moving Wilkes-Barre Forward',
'["downtown_revitalization", "public_safety", "regional_cooperation", "economic_development", "community_engagement"]',
'Mayor of Wilkes-Barre. Founder of the NEPA Mayors Committee connecting 15+ municipalities for regional solutions.',
'https://www.wilkes-barre.city/', '@MayorGCBrown', 8900, 167, 3400, 'influential', -0.45, 1);


-- =============================================================
-- MEDIA SOURCES (7 entries)
-- =============================================================

-- 9. The Times-Tribune (Newspaper - Scranton)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('times_tribune_media', 256), 'newsroom@thetimes-tribune.com', 'times_tribune', 'The Times-Tribune',
'Scrantons trusted newspaper since 1870. Covering local news, politics, sports, and community events throughout Lackawanna County and Northeast Pennsylvania.',
'18503', 'PA', 'Scranton', 2, 1, 3, 1);

SET @timestribune_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@timestribune_id, 'Your trusted source for NEPA news',
'["local_news", "politics", "education", "business", "sports"]',
'Daily newspaper serving Scranton and Lackawanna County. Part of MediaNews Group. Award-winning local journalism.',
'https://www.thetimes-tribune.com/', '@timestikipiece', 45000, 1250, 18500, 'premier', -0.15, 1);

-- 10. Times Leader (Newspaper - Wilkes-Barre)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('times_leader_media', 256), 'news@timesleader.com', 'times_leader', 'Times Leader',
'Wilkes-Barres community newspaper. Providing comprehensive coverage of Luzerne County news, government, education, and local sports.',
'18702', 'PA', 'Wilkes-Barre', 1, 1, 3, 1);

SET @timesleader_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@timesleader_id, 'Luzerne County news, your way',
'["local_news", "county_government", "courts", "education", "community"]',
'Daily newspaper serving Wilkes-Barre and Luzerne County. Comprehensive local government and court coverage.',
'https://www.timesleader.com/', '@TimesLeader', 38000, 980, 14200, 'premier', -0.10, 1);

-- 11. The Morning Call (Newspaper - Allentown/Lehigh Valley)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('morning_call_media', 256), 'news@mcall.com', 'morning_call', 'The Morning Call',
'The Lehigh Valleys leading newspaper. Award-winning coverage of Allentown, Bethlehem, Easton, and surrounding communities in Lehigh and Northampton counties.',
'18101', 'PA', 'Allentown', 4, 1, 3, 1);

SET @morningcall_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@morningcall_id, 'Lehigh Valley news that matters',
'["regional_news", "investigative", "business", "health", "education"]',
'Daily newspaper serving Lehigh Valley since 1883. Part of MediaNews Group. Pulitzer Prize-winning journalism.',
'https://www.mcall.com/', '@mcaboringcall', 62000, 1580, 24500, 'premier', -0.20, 1);

-- 12. WNEP-TV (Television - Scranton/Wilkes-Barre)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('wnep_tv_media', 256), 'news@wnep.com', 'wnep_news', 'WNEP News',
'WNEP-TV is Northeastern and Central Pennsylvanias news leader. Live local coverage, breaking news, weather, and community stories you can count on.',
'18512', 'PA', 'Moosic', 2, 1, 3, 1);

SET @wnep_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@wnep_id, 'NEPA and Central PAs news leader',
'["breaking_news", "weather", "local_news", "sports", "community"]',
'ABC affiliate serving 22 counties in Northeastern and Central Pennsylvania. Most-watched news in the region.',
'https://www.wnep.com/', '@WNABOREP', 125000, 3200, 58000, 'premier', 0.00, 1);

-- 13. WFMZ-TV 69News (Television - Lehigh Valley)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('wfmz_tv_media', 256), 'news@wfmz.com', 'wfmz_69news', 'WFMZ 69News',
'WFMZ-TV 69News - The Lehigh Valleys independent news source. 24/7 local news coverage for Allentown, Bethlehem, Easton, Reading, and surrounding areas.',
'18104', 'PA', 'Allentown', 4, 1, 3, 1);

SET @wfmz_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@wfmz_id, 'Your Lehigh Valley news source',
'["local_news", "traffic", "weather", "business", "health"]',
'Independent TV station serving Lehigh Valley and Berks County. 24-hour news channel with continuous local coverage.',
'https://www.wfmz.com/', '@69News', 89000, 2100, 42000, 'premier', 0.05, 1);

-- 14. Pocono Record (Newspaper - Monroe County)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('pocono_record_media', 256), 'news@poconorecord.com', 'pocono_record', 'Pocono Record',
'Monroe Countys community newspaper. Covering Stroudsburg, East Stroudsburg, the Poconos, and all of Monroe County since 1895.',
'18360', 'PA', 'Stroudsburg', 3, 1, 2, 1);

SET @poconorecord_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@poconorecord_id, 'Your Pocono region news source',
'["local_news", "tourism", "environment", "education", "real_estate"]',
'Daily newspaper serving Monroe County and the Pocono region. Part of Gannett/USA TODAY Network.',
'https://www.poconorecord.com/', '@PoconoRecord', 22000, 560, 8900, 'influential', -0.10, 1);

-- 15. Citizens Voice (Newspaper - Wilkes-Barre)
INSERT INTO civiq_users (voter_hash, email, username, display_name, bio, zip_code, state_code, city, county_id, is_voice, voice_level, is_verified)
VALUES (SHA2('citizens_voice_media', 256), 'news@citizensvoice.com', 'citizens_voice', 'Citizens Voice',
'Award-winning journalism for Luzerne County and the Wyoming Valley. In-depth local coverage, investigative reporting, and community news.',
'18702', 'PA', 'Wilkes-Barre', 1, 1, 2, 1);

SET @citizensvoice_id = LAST_INSERT_ID();

INSERT INTO civiq_voices (user_id, tagline, expertise_areas, credentials, website_url, twitter_handle, follower_count, response_count, total_likes_received, tier, lean_score, verified_journalist)
VALUES (@citizensvoice_id, 'Wyoming Valley news and investigation',
'["investigative", "local_government", "courts", "education", "community"]',
'Daily newspaper serving Luzerne County and Wyoming Valley. Part of MediaNews Group. Known for investigative journalism.',
'https://www.citizensvoice.com/', '@citizensvoice', 28000, 720, 11500, 'influential', -0.15, 1);


-- =============================================================
-- Verify the insertions
-- =============================================================
SELECT 'Users inserted:' as status, COUNT(*) as count FROM civiq_users WHERE is_voice = 1;
SELECT 'Voices inserted:' as status, COUNT(*) as count FROM civiq_voices;
