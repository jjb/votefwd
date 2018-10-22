DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 2000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'MO02', 'Propensity 5-75, Dem partisanship > 84.5.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='MO'
  AND congressional_district='2'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('12829842', '12854836', '12984662', '13002165', '13005249', '13010162', '132483452', '140437540', '14108252', '14413798', '14440506', '14832115', '15728708', '161203453', '1636228', '16720958', '16778032', '16873924', '168964105', '16958898', '17245747', '232984383', '272346150', '285414969', '290358824', '291689622', '330139265', '330140011', '356981947', '371188352', '379685751', '407762256', '540778439', '59236929', '65639181', '79035166', '83280646', '907587540')
  -- EXCLUDE DUPLICATES ALREADY IN THE VOTERS TABLE
  AND dwid NOT IN ('16870364', '14276457', '991643002');

  -- COUNT HOW MANY NEWLY ELIGIBLE VOTERS WE ADDED --

  populationtotal := (SELECT count(*) from experiment_voter WHERE cohort is null);
  RAISE NOTICE 'Inserted % eligible voters from catalist raw data into experiment_voter.', populationtotal;

  -- INITIALIZE ALL NEW POSSIBLE TARGETS AS CONTROLS --

  UPDATE experiment_voter
  SET cohort = 'CONTROL'
  WHERE experiment_voter.voter_id IN
  (
    SELECT voter_id FROM experiment_voter
    WHERE experiment_id = experimentid
    AND cohort is null
  );

  -- GRAB ALL VOTERS EXCLUDING TARGET CONTROL GROUP SIZE AT RANDOM AND UPDATE THEIR DESIGNATIONS
  targetcount := (SELECT populationtotal - controlcount);
  RAISE NOTICE 'Assigning % voters to the TEST group.', targetcount;

  UPDATE experiment_voter
  SET cohort = 'TEST'
  WHERE experiment_voter.voter_id IN
  (
    SELECT voter_id FROM experiment_voter
    WHERE experiment_id = experimentid
    ORDER BY RANDOM()
    LIMIT targetcount
  );

  RAISE NOTICE 'Assigned % voters to the TEST group.', targetcount;

  -- POPULATE SELECTED TEST SUBJECTS INTO VOTERS TO MAKE ADOPTABLE

  INSERT INTO voters
    ( registration_id,
      first_name,
      middle_name,
      last_name,
      suffix,
      address,
      city,
      state,
      zip,
      age,
      gender,
      district_id
    )
  SELECT dwid,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    concat_ws(' ', mail_address_line_1, mail_address_line_2),
    mail_address_city,
    mail_address_state,
    mail_address_zip,
    age::text::int,
    gender,
    'MO02'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='MO'
  AND congressional_district='2'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('12829842', '12854836', '12984662', '13002165', '13005249', '13010162', '132483452', '140437540', '14108252', '14413798', '14440506', '14832115', '15728708', '161203453', '1636228', '16720958', '16778032', '16873924', '168964105', '16958898', '17245747', '232984383', '272346150', '285414969', '290358824', '291689622', '330139265', '330140011', '356981947', '371188352', '379685751', '407762256', '540778439', '59236929', '65639181', '79035166', '83280646', '907587540')
  -- EXCLUDE DUPLICATES ALREADY IN THE VOTERS TABLE
  AND dwid NOT IN ('16870364', '14276457', '991643002');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
