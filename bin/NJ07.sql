DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'NJ07', 'Propensity 5-75, Dem partisanship > 86.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='NJ'
  AND congressional_district='7'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1002378295', '1002378362', '1002378651', '1002383500', '100719293', '1009128776', '1010351383', '1010352392', '1010580357', '1013409262', '103083512', '110096793', '112056972', '121325510', '233232359', '285754451', '300505088', '31343917', '32476423', '329360160', '33296913', '33891619', '342403651', '34710350', '36362035', '36412875', '382254502', '541586343', '89996107', '932102943', '987921931', '99594408');

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
    'NJ07'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='NJ'
  AND congressional_district='7'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1002378295', '1002378362', '1002378651', '1002383500', '100719293', '1009128776', '1010351383', '1010352392', '1010580357', '1013409262', '103083512', '110096793', '112056972', '121325510', '233232359', '285754451', '300505088', '31343917', '32476423', '329360160', '33296913', '33891619', '342403651', '34710350', '36362035', '36412875', '382254502', '541586343', '89996107', '932102943', '987921931', '99594408');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
