DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 2000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'FL15', 'Propensity 5-75, Dem partisanship > 94.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='FL'
  AND congressional_district='15'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('110100746', '113077267', '14158423', '154938728', '162416013', '206560431', '25154974', '303040706', '31283136', '319498327', '32228368', '38317366', '39203159', '40253240', '41580835', '49353502', '49637823', '50832422', '510504288', '89840352', '905272660', '910856808', '920262123', '', '409448712', '40320521', '38494144', '520804526', '38800799', '217652307', '38782493');

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
    'FL15'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='FL'
  AND congressional_district='15'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('110100746', '113077267', '14158423', '154938728', '162416013', '206560431', '25154974', '303040706', '31283136', '319498327', '32228368', '38317366', '39203159', '40253240', '41580835', '49353502', '49637823', '50832422', '510504288', '89840352', '905272660', '910856808', '920262123', '', '409448712', '40320521', '38494144', '520804526', '38800799', '217652307', '38782493');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
