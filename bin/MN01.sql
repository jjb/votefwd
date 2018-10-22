DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'MN01', 'Propensity 5-75, Dem partisanship > 84.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='MN'
  AND congressional_district='1'
  -- Exclude duplicates already in a Vote Forward experiment
  AND dwid NOT IN ('10353254', '10678356', '10846821', '10900102', '10929807', '10972594', '11075796', '11308819', '11309299', '11458527', '11617831', '11647365', '11771525', '11791620', '12256384', '12280208', '160650489', '169439348', '201224', '205558893', '205976045', '226880923', '319222336', '319736887', '349614575', '354402339', '356981947', '360940500', '367661450', '367664304', '380702213', '380737845', '396987152', '404805841', '404823353', '59348857', '59539769', '9011780', '9340710', '9777627', '9777886', '9890452');

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
    'MN01'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='MN'
  AND congressional_district='1'
  -- Exclude duplicates already in a Vote Forward experiment
  AND dwid NOT IN ('10353254', '10678356', '10846821', '10900102', '10929807', '10972594', '11075796', '11308819', '11309299', '11458527', '11617831', '11647365', '11771525', '11791620', '12256384', '12280208', '160650489', '169439348', '201224', '205558893', '205976045', '226880923', '319222336', '319736887', '349614575', '354402339', '356981947', '360940500', '367661450', '367664304', '380702213', '380737845', '396987152', '404805841', '404823353', '59348857', '59539769', '9011780', '9340710', '9777627', '9777886', '9890452');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
