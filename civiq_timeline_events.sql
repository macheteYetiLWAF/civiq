-- CIVIQ US Federal History Timeline Events
-- Generated: 2026-01-12
-- Powers the zoomable historical timeline feature

-- ============================================================================
-- TABLE: civiq_timeline_events
-- Historical events for interactive timeline visualization
-- ============================================================================

CREATE TABLE IF NOT EXISTS `civiq_timeline_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` ENUM('president', 'legislation', 'economic', 'war', 'milestone') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `start_year` INT NOT NULL,
  `end_year` INT NULL,
  `government_level` ENUM('federal', 'state', 'local') DEFAULT 'federal',
  `importance` INT NOT NULL CHECK (`importance` BETWEEN 1 AND 10),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_start_year` (`start_year`),
  INDEX `idx_importance` (`importance`),
  INDEX `idx_gov_level` (`government_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SEED DATA: PRE-1776 COLONIAL HISTORY (10+ events)
-- ============================================================================

INSERT INTO `civiq_timeline_events` (`category`, `title`, `description`, `start_year`, `end_year`, `government_level`, `importance`) VALUES

-- Colonial and Pre-Colonial Era
('milestone', 'Christopher Columbus arrives in the Americas', 'Italian explorer Christopher Columbus, sailing for Spain, reaches the Bahamas, initiating sustained European contact with the Americas.', 1492, NULL, 'federal', 9),
('milestone', 'Jamestown Colony Founded', 'First permanent English settlement in North America established in Virginia, marking the beginning of British colonization.', 1607, NULL, 'federal', 9),
('milestone', 'Mayflower Compact Signed', 'Pilgrims aboard the Mayflower sign the first governing document of Plymouth Colony, establishing self-governance principles.', 1620, NULL, 'federal', 8),
('milestone', 'Massachusetts Bay Colony Founded', 'Puritans establish Massachusetts Bay Colony, which becomes a model for self-governing colonies and representative assemblies.', 1630, NULL, 'federal', 7),
('milestone', 'First Colonial Legislature (Virginia House of Burgesses)', 'First representative assembly in the Americas convenes at Jamestown, establishing precedent for colonial self-government.', 1619, NULL, 'federal', 8),
('war', 'King Philip''s War', 'Devastating conflict between New England colonists and Native American tribes led by Metacom (King Philip), reshaping colonial-indigenous relations.', 1675, 1678, 'federal', 6),
('milestone', 'William Penn Founds Pennsylvania', 'Quaker William Penn establishes Pennsylvania as a "Holy Experiment" with religious tolerance and democratic principles.', 1681, NULL, 'federal', 7),
('milestone', 'Salem Witch Trials', 'Mass hysteria in colonial Massachusetts leads to execution of 20 people, later influencing American legal protections against unjust prosecution.', 1692, 1693, 'federal', 6),
('war', 'French and Indian War', 'Colonial theater of the Seven Years'' War; British victory removes French power from North America but leads to taxes that spark revolution.', 1754, 1763, 'federal', 9),
('legislation', 'Stamp Act', 'British Parliament imposes direct tax on American colonies, sparking "no taxation without representation" protests and colonial unity.', 1765, 1766, 'federal', 8),
('milestone', 'Boston Tea Party', 'Colonial protesters dump British tea into Boston Harbor to protest taxation without representation, escalating tensions toward revolution.', 1773, NULL, 'federal', 8),
('milestone', 'First Continental Congress', 'Delegates from 12 colonies meet in Philadelphia to coordinate response to British policies, first unified colonial government.', 1774, NULL, 'federal', 9),

-- ============================================================================
-- SEED DATA: US PRESIDENTS (47 total through 2025)
-- ============================================================================

-- 1st through 10th Presidents
('president', 'George Washington (1st President)', 'Commander of Continental Army and first President. Established many presidential precedents including two-term limit and peaceful transfer of power.', 1789, 1797, 'federal', 10),
('president', 'John Adams (2nd President)', 'Founding Father, diplomat, first Vice President. Avoided war with France through diplomacy despite political cost.', 1797, 1801, 'federal', 8),
('president', 'Thomas Jefferson (3rd President)', 'Author of Declaration of Independence. Louisiana Purchase doubled nation''s size. Founded University of Virginia.', 1801, 1809, 'federal', 10),
('president', 'James Madison (4th President)', 'Father of the Constitution and Bill of Rights. Led nation through War of 1812 against Britain.', 1809, 1817, 'federal', 9),
('president', 'James Monroe (5th President)', 'Monroe Doctrine established U.S. opposition to European colonialism in Americas. Era of Good Feelings presidency.', 1817, 1825, 'federal', 7),
('president', 'John Quincy Adams (6th President)', 'Son of John Adams, skilled diplomat. Promoted infrastructure and education despite congressional opposition.', 1825, 1829, 'federal', 6),
('president', 'Andrew Jackson (7th President)', 'Populist hero of common man, founder of Democratic Party. Controversial Indian Removal Act and bank war.', 1829, 1837, 'federal', 8),
('president', 'Martin Van Buren (8th President)', 'First president born as U.S. citizen. Presidency marked by Panic of 1837 economic depression.', 1837, 1841, 'federal', 5),
('president', 'William Henry Harrison (9th President)', 'Longest inaugural address, shortest presidency (31 days). Died of pneumonia, first president to die in office.', 1841, 1841, 'federal', 4),
('president', 'John Tyler (10th President)', 'First vice president to assume presidency due to death. Established precedent for full presidential succession.', 1841, 1845, 'federal', 5),

-- 11th through 20th Presidents
('president', 'James K. Polk (11th President)', 'Expansionist who added Texas, Oregon Territory, and Mexican Cession. Achieved all major goals in single term.', 1845, 1849, 'federal', 7),
('president', 'Zachary Taylor (12th President)', 'Mexican-American War hero. Died in office after 16 months, possibly from gastroenteritis.', 1849, 1850, 'federal', 4),
('president', 'Millard Fillmore (13th President)', 'Signed Compromise of 1850 including Fugitive Slave Act. Last Whig president.', 1850, 1853, 'federal', 4),
('president', 'Franklin Pierce (14th President)', 'Kansas-Nebraska Act reopened slavery debate. Presidency worsened sectional tensions preceding Civil War.', 1853, 1857, 'federal', 4),
('president', 'James Buchanan (15th President)', 'Failed to prevent Southern secession. Often ranked among worst presidents for inaction on slavery crisis.', 1857, 1861, 'federal', 3),
('president', 'Abraham Lincoln (16th President)', 'Preserved the Union, abolished slavery via Emancipation Proclamation and 13th Amendment. Assassinated 1865.', 1861, 1865, 'federal', 10),
('president', 'Andrew Johnson (17th President)', 'First president impeached (acquitted by one vote). Lenient Reconstruction policies opposed by Congress.', 1865, 1869, 'federal', 4),
('president', 'Ulysses S. Grant (18th President)', 'Civil War general who won the war. Presidency marred by scandals but supported civil rights for freedmen.', 1869, 1877, 'federal', 6),
('president', 'Rutherford B. Hayes (19th President)', 'Disputed 1876 election resolved by Compromise of 1877, ending Reconstruction. Civil service reform advocate.', 1877, 1881, 'federal', 5),
('president', 'James A. Garfield (20th President)', 'Advocated civil rights and education reform. Assassinated after 200 days by disappointed office seeker.', 1881, 1881, 'federal', 5),

-- 21st through 30th Presidents
('president', 'Chester A. Arthur (21st President)', 'Surprised critics by supporting civil service reform (Pendleton Act) despite machine politics background.', 1881, 1885, 'federal', 5),
('president', 'Grover Cleveland (22nd President)', 'Only president to serve non-consecutive terms. Known for honesty and fighting political corruption.', 1885, 1889, 'federal', 6),
('president', 'Benjamin Harrison (23rd President)', 'Grandson of William Henry Harrison. Sherman Antitrust Act and McKinley Tariff passed during term.', 1889, 1893, 'federal', 5),
('president', 'Grover Cleveland (24th President)', 'Second non-consecutive term. Faced severe economic depression (Panic of 1893) and labor unrest.', 1893, 1897, 'federal', 6),
('president', 'William McKinley (25th President)', 'Spanish-American War victory, acquired Philippines, Puerto Rico, Guam. Assassinated 1901 by anarchist.', 1897, 1901, 'federal', 7),
('president', 'Theodore Roosevelt (26th President)', 'Progressive reformer, trust-buster, conservationist. Nobel Peace Prize for ending Russo-Japanese War. Built Panama Canal.', 1901, 1909, 'federal', 9),
('president', 'William Howard Taft (27th President)', 'More antitrust prosecutions than TR. Later became Chief Justice of Supreme Court, only person to lead two branches.', 1909, 1913, 'federal', 6),
('president', 'Woodrow Wilson (28th President)', 'Led U.S. through WWI. League of Nations advocate (rejected by Senate). Progressive domestic reforms.', 1913, 1921, 'federal', 8),
('president', 'Warren G. Harding (29th President)', 'Return to normalcy after WWI. Presidency plagued by Teapot Dome and other scandals. Died in office.', 1921, 1923, 'federal', 4),
('president', 'Calvin Coolidge (30th President)', 'Small government conservative during Roaring Twenties prosperity. "Silent Cal" known for few words.', 1923, 1929, 'federal', 5),

-- 31st through 40th Presidents
('president', 'Herbert Hoover (31st President)', 'Great humanitarian before presidency. Unable to reverse Great Depression, lost 1932 landslide to FDR.', 1929, 1933, 'federal', 5),
('president', 'Franklin D. Roosevelt (32nd President)', 'Only president elected four times. New Deal transformed government role. Led nation through WWII. Died in office 1945.', 1933, 1945, 'federal', 10),
('president', 'Harry S. Truman (33rd President)', 'Ended WWII with atomic bombs. Marshall Plan, NATO, Korean War, desegregated military. "The buck stops here."', 1945, 1953, 'federal', 9),
('president', 'Dwight D. Eisenhower (34th President)', 'WWII Supreme Allied Commander. Interstate Highway System. Warned of military-industrial complex. Moderate Republican.', 1953, 1961, 'federal', 8),
('president', 'John F. Kennedy (35th President)', 'Youngest elected president. Cuban Missile Crisis, Peace Corps, space race. Assassinated in Dallas November 1963.', 1961, 1963, 'federal', 8),
('president', 'Lyndon B. Johnson (36th President)', 'Great Society programs, Civil Rights Act, Voting Rights Act, Medicare. Vietnam War escalation led to not seeking reelection.', 1963, 1969, 'federal', 8),
('president', 'Richard Nixon (37th President)', 'Opened relations with China, created EPA, ended Vietnam involvement. Only president to resign (Watergate scandal).', 1969, 1974, 'federal', 7),
('president', 'Gerald Ford (38th President)', 'Only president never elected to executive office. Pardoned Nixon, controversial but aimed to heal nation.', 1974, 1977, 'federal', 5),
('president', 'Jimmy Carter (39th President)', 'Camp David Accords peace between Israel and Egypt. Iranian hostage crisis and energy crisis defined term. Nobel Peace Prize 2002.', 1977, 1981, 'federal', 6),
('president', 'Ronald Reagan (40th President)', 'Conservative revolution, tax cuts, military buildup. Cold War rhetoric, Iran-Contra scandal. "Great Communicator."', 1981, 1989, 'federal', 8),

-- 41st through 47th Presidents
('president', 'George H. W. Bush (41st President)', 'Gulf War victory, end of Cold War, ADA signed. "Read my lips" tax pledge broken, lost 1992 reelection.', 1989, 1993, 'federal', 6),
('president', 'Bill Clinton (42nd President)', 'Economic prosperity, budget surplus. NAFTA, welfare reform. Second president impeached (acquitted) over Monica Lewinsky scandal.', 1993, 2001, 'federal', 7),
('president', 'George W. Bush (43rd President)', '9/11 response, Afghanistan and Iraq wars, War on Terror, TARP bank bailout. Controversial 2000 election decided by Supreme Court.', 2001, 2009, 'federal', 7),
('president', 'Barack Obama (44th President)', 'First African American president. Affordable Care Act, killed Osama bin Laden, economic recovery from Great Recession. Nobel Peace Prize 2009.', 2009, 2017, 'federal', 8),
('president', 'Donald Trump (45th President)', 'First president with no prior government or military experience. Tax cuts, three Supreme Court justices. First president impeached twice.', 2017, 2021, 'federal', 7),
('president', 'Joe Biden (46th President)', 'Oldest president inaugurated at 78. COVID-19 response, infrastructure bill, withdrew from Afghanistan. Did not seek reelection.', 2021, 2025, 'federal', 7),
('president', 'Donald Trump (47th President)', 'First president to serve non-consecutive terms since Grover Cleveland. Second term began January 2025.', 2025, NULL, 'federal', 7),

-- ============================================================================
-- SEED DATA: MAJOR LEGISLATION (30+ laws)
-- ============================================================================

-- Founding Documents and Early Republic
('legislation', 'Declaration of Independence', 'Formal declaration of independence from Britain, articulating natural rights philosophy: "all men are created equal."', 1776, NULL, 'federal', 10),
('legislation', 'Articles of Confederation', 'First constitution of the United States, creating weak central government. Replaced by Constitution in 1789.', 1781, 1789, 'federal', 7),
('legislation', 'U.S. Constitution Ratified', 'Supreme law establishing federal government structure: executive, legislative, judicial branches with checks and balances.', 1788, NULL, 'federal', 10),
('legislation', 'Bill of Rights (First 10 Amendments)', 'First ten amendments guaranteeing fundamental rights: speech, religion, press, arms, due process, jury trial, etc.', 1791, NULL, 'federal', 10),
('legislation', 'Judiciary Act of 1789', 'Established federal court system including Supreme Court structure and district courts.', 1789, NULL, 'federal', 8),
('legislation', 'Northwest Ordinance', 'Established process for admitting new states and banned slavery in Northwest Territory.', 1787, NULL, 'federal', 8),

-- 19th Century Legislation
('legislation', 'Missouri Compromise', 'Admitted Missouri as slave state, Maine as free state, prohibited slavery north of 36-30 line.', 1820, NULL, 'federal', 7),
('legislation', 'Indian Removal Act', 'Authorized forced relocation of Native Americans from southeastern states (Trail of Tears).', 1830, NULL, 'federal', 7),
('legislation', 'Fugitive Slave Act', 'Required return of escaped slaves to owners, intensified sectional conflict over slavery.', 1850, NULL, 'federal', 6),
('legislation', 'Kansas-Nebraska Act', 'Allowed popular sovereignty on slavery in new territories, effectively repealed Missouri Compromise.', 1854, NULL, 'federal', 7),
('legislation', 'Homestead Act', 'Granted 160 acres of public land to settlers who improved it, accelerating Western expansion.', 1862, NULL, 'federal', 8),
('legislation', 'Morrill Land-Grant Act', 'Granted federal land to states for agricultural and mechanical colleges, creating land-grant university system.', 1862, NULL, 'federal', 7),
('legislation', '13th Amendment (Abolition of Slavery)', 'Constitutional amendment abolishing slavery and involuntary servitude throughout the United States.', 1865, NULL, 'federal', 10),
('legislation', '14th Amendment (Equal Protection)', 'Granted citizenship to all born in U.S., guaranteed equal protection and due process of law.', 1868, NULL, 'federal', 10),
('legislation', '15th Amendment (Voting Rights)', 'Prohibited denial of voting rights based on race, color, or previous condition of servitude.', 1870, NULL, 'federal', 9),
('legislation', 'Sherman Antitrust Act', 'First federal law prohibiting monopolies and anticompetitive business practices.', 1890, NULL, 'federal', 8),

-- Progressive Era and Early 20th Century
('legislation', 'Pure Food and Drug Act', 'Created FDA predecessor, prohibited adulterated or misbranded food and drugs in interstate commerce.', 1906, NULL, 'federal', 7),
('legislation', '16th Amendment (Income Tax)', 'Authorized federal income tax, fundamentally changing government revenue and fiscal policy.', 1913, NULL, 'federal', 8),
('legislation', '17th Amendment (Direct Election of Senators)', 'Changed election of U.S. Senators from state legislatures to direct popular vote.', 1913, NULL, 'federal', 7),
('legislation', 'Federal Reserve Act', 'Created Federal Reserve System as central bank to provide elastic currency and banking stability.', 1913, NULL, 'federal', 9),
('legislation', '18th Amendment (Prohibition)', 'Banned manufacture, sale, and transportation of alcoholic beverages. Repealed by 21st Amendment in 1933.', 1919, 1933, 'federal', 7),
('legislation', '19th Amendment (Women''s Suffrage)', 'Guaranteed women the right to vote after decades of suffragist activism.', 1920, NULL, 'federal', 10),

-- New Deal Era
('legislation', 'Social Security Act', 'Created Social Security system providing old-age pensions, unemployment insurance, and welfare assistance.', 1935, NULL, 'federal', 10),
('legislation', 'National Labor Relations Act (Wagner Act)', 'Guaranteed workers'' rights to organize unions and bargain collectively.', 1935, NULL, 'federal', 8),
('legislation', 'Fair Labor Standards Act', 'Established minimum wage, overtime pay, and child labor restrictions for workers.', 1938, NULL, 'federal', 8),

-- Civil Rights Era
('legislation', 'Civil Rights Act of 1964', 'Landmark law prohibiting discrimination based on race, color, religion, sex, or national origin in employment and public accommodations.', 1964, NULL, 'federal', 10),
('legislation', 'Voting Rights Act of 1965', 'Outlawed discriminatory voting practices including literacy tests; required federal oversight of elections in affected areas.', 1965, NULL, 'federal', 10),
('legislation', 'Medicare and Medicaid Act', 'Created Medicare health insurance for elderly and Medicaid for low-income Americans.', 1965, NULL, 'federal', 9),
('legislation', 'Fair Housing Act', 'Prohibited discrimination in housing sales, rentals, and financing based on race, religion, national origin, sex.', 1968, NULL, 'federal', 8),
('legislation', '26th Amendment (Voting Age 18)', 'Lowered voting age from 21 to 18, responding to argument that draft-age citizens should vote.', 1971, NULL, 'federal', 7),

-- Modern Era Legislation
('legislation', 'Clean Air Act', 'Comprehensive federal law regulating air emissions from stationary and mobile sources, establishing EPA authority.', 1970, NULL, 'federal', 8),
('legislation', 'Clean Water Act', 'Primary federal law governing water pollution, establishing structure for regulating pollutant discharges.', 1972, NULL, 'federal', 8),
('legislation', 'Americans with Disabilities Act', 'Prohibited discrimination against individuals with disabilities in employment, transportation, public accommodations.', 1990, NULL, 'federal', 8),
('legislation', 'North American Free Trade Agreement (NAFTA)', 'Created free trade zone between U.S., Canada, and Mexico. Replaced by USMCA in 2020.', 1994, 2020, 'federal', 7),
('legislation', 'Personal Responsibility and Work Opportunity Act', 'Welfare reform ending AFDC, creating TANF with work requirements and time limits.', 1996, NULL, 'federal', 7),
('legislation', 'USA PATRIOT Act', 'Expanded surveillance and law enforcement powers after 9/11; controversial civil liberties implications.', 2001, NULL, 'federal', 7),
('legislation', 'Medicare Prescription Drug Act', 'Created Medicare Part D prescription drug benefit, largest expansion of Medicare since 1965.', 2003, NULL, 'federal', 7),
('legislation', 'Affordable Care Act (Obamacare)', 'Major healthcare reform expanding coverage through mandates, exchanges, and Medicaid expansion.', 2010, NULL, 'federal', 9),
('legislation', 'Dodd-Frank Wall Street Reform Act', 'Financial regulation overhaul after 2008 crisis, created Consumer Financial Protection Bureau.', 2010, NULL, 'federal', 8),

-- ============================================================================
-- SEED DATA: ECONOMIC EVENTS (15+ events)
-- ============================================================================

('economic', 'Panic of 1819', 'First major peacetime financial crisis in U.S., caused by post-War of 1812 speculation and European demand collapse.', 1819, 1821, 'federal', 6),
('economic', 'Panic of 1837', 'Severe financial crisis triggered by speculative lending practices and Jackson''s bank policies. Depression lasted until 1843.', 1837, 1843, 'federal', 7),
('economic', 'Panic of 1857', 'Financial panic caused by declining international economy and overexpansion of domestic economy, particularly railroads.', 1857, 1858, 'federal', 6),
('economic', 'Panic of 1873 (Long Depression)', 'Severe economic depression triggered by railroad overbuilding and European financial crisis. Lasted until 1879.', 1873, 1879, 'federal', 7),
('economic', 'Panic of 1893', 'Severe economic depression with railroad failures, bank failures, and 19% unemployment. Led to gold standard debates.', 1893, 1897, 'federal', 7),
('economic', 'Panic of 1907', 'Financial crisis that led to creation of Federal Reserve System. J.P. Morgan organized banker bailout.', 1907, 1908, 'federal', 7),
('economic', 'Roaring Twenties Economic Boom', 'Period of economic prosperity with rapid industrial growth, technological advancement, and stock market speculation.', 1920, 1929, 'federal', 7),
('economic', 'Stock Market Crash of 1929', 'Black Tuesday crash on October 29, 1929 triggered the Great Depression. Dow lost 89% of value by 1932.', 1929, NULL, 'federal', 9),
('economic', 'Great Depression', 'Most severe economic depression in U.S. history with 25% unemployment, bank failures, and global economic collapse.', 1929, 1939, 'federal', 10),
('economic', 'Post-WWII Economic Boom', 'Unprecedented economic expansion after World War II, creation of middle class, suburban growth, and American dominance.', 1945, 1973, 'federal', 8),
('economic', 'Stagflation Crisis', 'Period of high inflation combined with economic stagnation and unemployment, challenging Keynesian economics.', 1973, 1982, 'federal', 7),
('economic', 'Black Monday (1987)', 'Stock market crash on October 19, 1987 with Dow dropping 22.6% in single day, largest one-day percentage decline.', 1987, NULL, 'federal', 7),
('economic', 'Dot-Com Bubble Burst', 'Collapse of technology stock speculation, NASDAQ lost 78% from peak. Recession followed in 2001.', 2000, 2002, 'federal', 7),
('economic', 'Great Recession', 'Severe global economic downturn triggered by subprime mortgage crisis and financial system near-collapse.', 2007, 2009, 'federal', 9),
('economic', 'Housing Market Crash', 'Collapse of U.S. housing bubble, triggering foreclosure crisis and Great Recession. Home values dropped 30%+.', 2007, 2012, 'federal', 8),
('economic', 'COVID-19 Economic Crisis', 'Pandemic-induced economic shutdown causing record unemployment spike, followed by rapid recovery and inflation surge.', 2020, 2022, 'federal', 8),

-- ============================================================================
-- SEED DATA: MAJOR WARS AND CONFLICTS
-- ============================================================================

('war', 'American Revolutionary War', 'War of independence from Great Britain (1775-1783). Victory established United States as independent nation.', 1775, 1783, 'federal', 10),
('war', 'War of 1812', 'Conflict with Britain over trade restrictions, impressment, and British support of Native Americans. White House burned.', 1812, 1815, 'federal', 7),
('war', 'Mexican-American War', 'War resulting in U.S. acquisition of California, Nevada, Utah, Arizona, New Mexico, and parts of Colorado, Wyoming.', 1846, 1848, 'federal', 8),
('war', 'American Civil War', 'War between Union and Confederate states over slavery and states'' rights. 620,000+ deaths, slavery abolished.', 1861, 1865, 'federal', 10),
('war', 'Spanish-American War', 'Brief war resulting in U.S. acquisition of Puerto Rico, Guam, Philippines, and Cuban independence from Spain.', 1898, 1898, 'federal', 7),
('war', 'World War I (U.S. Involvement)', 'U.S. entered 1917 after unrestricted submarine warfare. American forces helped turn tide for Allied victory.', 1917, 1918, 'federal', 9),
('war', 'World War II (U.S. Involvement)', 'Global conflict after Pearl Harbor attack. U.S. became "arsenal of democracy," emerged as superpower.', 1941, 1945, 'federal', 10),
('war', 'Korean War', 'First major Cold War military conflict. U.S.-led UN forces defended South Korea. Ended in armistice, not peace treaty.', 1950, 1953, 'federal', 8),
('war', 'Vietnam War', 'Prolonged conflict in Southeast Asia. 58,000+ American deaths. Controversial domestically, ended with fall of Saigon 1975.', 1955, 1975, 'federal', 9),
('war', 'Gulf War (Operation Desert Storm)', 'Coalition response to Iraq''s invasion of Kuwait. Quick military victory liberated Kuwait in 100-hour ground war.', 1990, 1991, 'federal', 7),
('war', 'War in Afghanistan', 'Longest U.S. war, response to 9/11 attacks. Taliban removed, bin Laden killed 2011. U.S. withdrew 2021.', 2001, 2021, 'federal', 8),
('war', 'Iraq War', 'Invasion to remove Saddam Hussein based on WMD claims (not found). Protracted occupation, sectarian conflict.', 2003, 2011, 'federal', 8),

-- ============================================================================
-- SEED DATA: MAJOR MILESTONES
-- ============================================================================

('milestone', 'Declaration of Independence Signed', 'Continental Congress adopts and signs Declaration of Independence on July 4, 1776, declaring American independence.', 1776, NULL, 'federal', 10),
('milestone', 'Constitutional Convention', 'Delegates in Philadelphia draft new Constitution replacing Articles of Confederation, creating stronger federal government.', 1787, NULL, 'federal', 10),
('milestone', 'Louisiana Purchase', 'U.S. purchases 828,000 square miles from France for $15 million, doubling nation''s size.', 1803, NULL, 'federal', 9),
('milestone', 'Lewis and Clark Expedition', 'Corps of Discovery explores Louisiana Purchase territory to Pacific Ocean, mapping western lands.', 1804, 1806, 'federal', 7),
('milestone', 'Erie Canal Opens', 'Engineering marvel connecting Great Lakes to Atlantic Ocean, transforming American commerce and westward expansion.', 1825, NULL, 'federal', 7),
('milestone', 'California Gold Rush', 'Discovery of gold at Sutter''s Mill triggers massive westward migration, accelerating California statehood.', 1848, 1855, 'federal', 8),
('milestone', 'Transcontinental Railroad Completed', 'Golden Spike at Promontory Summit connects East and West coasts by rail, transforming national economy.', 1869, NULL, 'federal', 9),
('milestone', 'Statue of Liberty Dedicated', 'Gift from France dedicated in New York Harbor, becoming symbol of freedom and immigration.', 1886, NULL, 'federal', 8),
('milestone', 'Wright Brothers First Flight', 'First controlled, sustained flight of powered heavier-than-air aircraft at Kitty Hawk, North Carolina.', 1903, NULL, 'federal', 8),
('milestone', 'Ford Model T Production Begins', 'Assembly line production makes automobiles affordable for middle class, transforming American life and industry.', 1908, NULL, 'federal', 8),
('milestone', 'Women Gain Right to Vote', '19th Amendment ratified August 18, 1920, after 72 years of women''s suffrage movement.', 1920, NULL, 'federal', 9),
('milestone', 'Stock Market Crash Begins Great Depression', 'Black Tuesday crash October 29, 1929 begins worst economic crisis in American history.', 1929, NULL, 'federal', 9),
('milestone', 'Pearl Harbor Attack', 'Japanese attack on December 7, 1941 brings U.S. into World War II. "A date which will live in infamy."', 1941, NULL, 'federal', 10),
('milestone', 'D-Day Invasion', 'Allied forces land at Normandy June 6, 1944, beginning liberation of Western Europe from Nazi Germany.', 1944, NULL, 'federal', 9),
('milestone', 'Atomic Bombs End WWII', 'U.S. drops atomic bombs on Hiroshima (Aug 6) and Nagasaki (Aug 9), Japan surrenders.', 1945, NULL, 'federal', 10),
('milestone', 'United Nations Founded', 'U.S. hosts founding of United Nations in San Francisco to maintain international peace and security.', 1945, NULL, 'federal', 8),
('milestone', 'Brown v. Board of Education', 'Supreme Court rules "separate but equal" unconstitutional, ordering school desegregation.', 1954, NULL, 'federal', 10),
('milestone', 'Montgomery Bus Boycott', 'Year-long boycott after Rosa Parks'' arrest sparks civil rights movement, leads to bus desegregation.', 1955, 1956, 'federal', 8),
('milestone', 'Sputnik Launches Space Race', 'Soviet satellite launch spurs U.S. space program, creation of NASA, and science education emphasis.', 1957, NULL, 'federal', 8),
('milestone', 'March on Washington', 'Martin Luther King Jr.''s "I Have a Dream" speech at Lincoln Memorial before 250,000 people.', 1963, NULL, 'federal', 9),
('milestone', 'JFK Assassination', 'President Kennedy assassinated in Dallas, November 22, 1963. Lyndon Johnson sworn in same day.', 1963, NULL, 'federal', 9),
('milestone', 'Apollo 11 Moon Landing', 'Neil Armstrong becomes first human to walk on moon July 20, 1969. "One small step for man..."', 1969, NULL, 'federal', 10),
('milestone', 'Watergate Scandal', 'Political scandal leading to first presidential resignation. Demonstrated accountability of executive branch.', 1972, 1974, 'federal', 9),
('milestone', 'Nixon Resigns', 'Richard Nixon becomes first U.S. president to resign, August 9, 1974, due to Watergate scandal.', 1974, NULL, 'federal', 9),
('milestone', 'Fall of Berlin Wall', 'End of Cold War symbol as East Germans breach Berlin Wall November 9, 1989.', 1989, NULL, 'federal', 9),
('milestone', 'September 11 Attacks', 'Terrorist attacks kill nearly 3,000 people, destroy World Trade Center, damage Pentagon. War on Terror begins.', 2001, NULL, 'federal', 10),
('milestone', 'Hurricane Katrina', 'Catastrophic hurricane devastates Gulf Coast, exposes failures in emergency response and infrastructure.', 2005, NULL, 'federal', 8),
('milestone', 'First African American President Elected', 'Barack Obama elected 44th president, historic milestone in American racial progress.', 2008, NULL, 'federal', 9),
('milestone', 'Osama bin Laden Killed', 'U.S. Navy SEALs kill al-Qaeda leader in Pakistan raid, nearly 10 years after 9/11 attacks.', 2011, NULL, 'federal', 8),
('milestone', 'Marriage Equality Nationwide', 'Supreme Court rules in Obergefell v. Hodges that same-sex marriage is constitutional right.', 2015, NULL, 'federal', 8),
('milestone', 'COVID-19 Pandemic Begins', 'Global pandemic declared March 2020, leading to unprecedented public health measures and societal disruption.', 2020, NULL, 'federal', 9),
('milestone', 'January 6 Capitol Attack', 'Mob storms U.S. Capitol during electoral vote certification, unprecedented assault on peaceful transfer of power.', 2021, NULL, 'federal', 9);
