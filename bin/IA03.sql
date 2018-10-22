DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'IA03', 'Propensity 5-75, Dem partisanship > 90.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='IA'
  AND congressional_district='3'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1007920547', '12256384', '123796756', '13002165', '138113829', '175702554', '205926740', '276526675', '276580311', '276605272', '300457826', '32229260', '343493036', '358629512', '361614772', '403120617', '404638119', '404823353', '540045596', '57821637', '57832017', '57848833', '57851495', '57851876', '57856960', '57868670', '59082093', '59236929', '59246829', '59301978', '59315513', '59348857', '59384972', '59817451', '79035166', '914040468', '9170162', '921543093', '932253250', '988600524', '989912809');

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
    'IA03'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='IA'
  AND congressional_district='3'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('1007920547', '12256384', '123796756', '13002165', '138113829', '175702554', '205926740', '276526675', '276580311', '276605272', '300457826', '32229260', '343493036', '358629512', '361614772', '403120617', '404638119', '404823353', '540045596', '57821637', '57832017', '57848833', '57851495', '57851876', '57856960', '57868670', '59082093', '59236929', '59246829', '59301978', '59315513', '59348857', '59384972', '59817451', '79035166', '914040468', '9170162', '921543093', '932253250', '988600524', '989912809');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
