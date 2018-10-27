DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'NJ03', 'Propensity 5-75, Dem partisanship > 86.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='NJ'
  AND congressional_district='3'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1002397117', '1013037622', '110114341', '110120550', '118519258', '118912738', '118917443', '118921614', '118988675', '119046412', '121152947', '121266139', '121300269', '121714625', '121927481', '121996893', '139321021', '140199372', '157617390', '157901621', '159527701', '159933565', '181591687', '279687939', '30830845', '31263391', '31288908', '31324315', '31332937', '31369332', '31411211', '31457665', '31577025', '31616447', '31617945', '322748583', '323773070', '341477739', '342736115', '342749945', '343062569', '34485083', '360500660', '36513311', '368940077', '38647232', '39292735', '411641859', '8449548', '905759523', '919628512', '923595739', '925493080', '925598688', '927477082', '928697438', '988981316', '989791314');

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
    'NJ03'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='NJ'
  AND congressional_district='3'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1002397117', '1013037622', '110114341', '110120550', '118519258', '118912738', '118917443', '118921614', '118988675', '119046412', '121152947', '121266139', '121300269', '121714625', '121927481', '121996893', '139321021', '140199372', '157617390', '157901621', '159527701', '159933565', '181591687', '279687939', '30830845', '31263391', '31288908', '31324315', '31332937', '31369332', '31411211', '31457665', '31577025', '31616447', '31617945', '322748583', '323773070', '341477739', '342736115', '342749945', '343062569', '34485083', '360500660', '36513311', '368940077', '38647232', '39292735', '411641859', '8449548', '905759523', '919628512', '923595739', '925493080', '925598688', '927477082', '928697438', '988981316', '989791314');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
