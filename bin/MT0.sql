DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'MT0', 'Propensity 5-75, Dem partisanship > 88.5.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE mail_address_line_1 is not null
  AND mail_address_city is not null
  AND mail_address_state is not null
  AND mail_address_zip is not null
  AND mail_address_state='MT'
  AND state='MT'
  -- Catalist designates the at-large district '1' rather than '0'
  AND congressional_district='1'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('100626234', '1008612563', '1010849360', '10811442', '11888741', '123156558', '146107085', '146144229', '146546345', '147276849', '15044737', '228967593', '250980624', '25147322', '26502161', '27124276', '274369933', '274389122', '27639799', '27646110', '276498054', '318132690', '324872669', '324876109', '330485293', '347904759', '404570067', '43126224', '56612088', '8449548', '86464703', '90523778', '90583009', '90585704', '90645749', '90661506', '90661507', '92941696', '93037919', '93052343', '93099748', '93099874', '93116101', '93178923', '93204717', '93325766', '93335667', '93356690', '93356691', '989900270', '989912031', '989973709');

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
    'MT0'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='MT'
  AND congressional_district='1'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('100626234', '1008612563', '1010849360', '10811442', '11888741', '123156558', '146107085', '146144229', '146546345', '147276849', '15044737', '228967593', '250980624', '25147322', '26502161', '27124276', '274369933', '274389122', '27639799', '27646110', '276498054', '318132690', '324872669', '324876109', '330485293', '347904759', '404570067', '43126224', '56612088', '8449548', '86464703', '90523778', '90583009', '90585704', '90645749', '90661506', '90661507', '92941696', '93037919', '93052343', '93099748', '93099874', '93116101', '93178923', '93204717', '93325766', '93335667', '93356690', '93356691', '989900270', '989912031', '989973709');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
