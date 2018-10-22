DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'FL26', 'Propensity 5-75, Dem partisanship > 90.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='FL'
  AND congressional_district='26'
  -- Exclude duplicates already in a Vote Forward experiment
  AND dwid NOT IN ('122972036', '146932135', '151814476', '160441307', '160450670', '160465632', '168307148', '219063968', '223596652', '223867221', '224053521', '226630967', '226736043', '263865700', '27516774', '296913459', '300690573', '329625101', '344601527', '344618119', '351471512', '353136037', '35569096', '358736819', '380705614', '404994287', '406360413', '408544296', '409504780', '409661118', '42124701', '42901809', '42977200', '43044502', '43121062', '43122640', '43186273', '43398280', '43455588', '43459654', '43624033', '43741262', '43807638', '43820367', '43870452', '43915792', '43943362', '43990395', '44056938', '44739862', '47395594', '510523252', '512821139', '520880192', '520886537', '534964415', '920179627', '920261444', '925670802', '977140074', '979567969', '981633086')
  -- Exclude duplicates already in a VPC experiment
  AND dwid NOT IN ('222630877','172980619');

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
    'FL26'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='FL'
  AND congressional_district='26'
  -- Exclude duplicates already in a Vote Forward experiment
  AND dwid NOT IN ('122972036', '146932135', '151814476', '160441307', '160450670', '160465632', '168307148', '219063968', '223596652', '223867221', '224053521', '226630967', '226736043', '263865700', '27516774', '296913459', '300690573', '329625101', '344601527', '344618119', '351471512', '353136037', '35569096', '358736819', '380705614', '404994287', '406360413', '408544296', '409504780', '409661118', '42124701', '42901809', '42977200', '43044502', '43121062', '43122640', '43186273', '43398280', '43455588', '43459654', '43624033', '43741262', '43807638', '43820367', '43870452', '43915792', '43943362', '43990395', '44056938', '44739862', '47395594', '510523252', '512821139', '520880192', '520886537', '534964415', '920179627', '920261444', '925670802', '977140074', '979567969', '981633086')
  -- Exclude duplicates already in a VPC experiment
  AND dwid NOT IN ('222630877','172980619');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
