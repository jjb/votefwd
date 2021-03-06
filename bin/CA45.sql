DO $$

DECLARE
  experimentid integer;
  populationtotal integer;
  controlcount integer:= 1000;
  targetcount integer;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'CA45', 'Propensity 5-75, Dem partisanship > 92.')
    RETURNING id INTO experimentid;

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- INSERT IDs OF ALL ELIGIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw
  WHERE registration_address_line_1 = mail_address_line_1
  AND state='CA'
  AND congressional_district='45'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('100051727', '100072023', '100072444', '100082373', '100088370', '100133392', '100141052', '100150364', '100158501', '100160549', '100171700', '100199313', '100254424', '100267109', '100318555', '100323959', '100346958', '100347544', '100351898', '100385955', '100392009', '100404152', '100413649', '100418003', '100439382', '100500291', '100541089', '100546619', '100554858', '100614031', '100622278', '100646385', '100690128', '100711786', '100712891', '100719293', '100780946', '100810366', '100853298', '100880264', '100922480', '100938775', '100944100', '100977975', '100997073', '104174451', '104352169', '111879781', '124210963', '125964553', '146163478', '181871711', '182824354', '183184778', '184144173', '184392401', '185596739', '185613770', '196273479', '241264685', '243255723', '244075327', '244842906', '245035277', '246090424', '247635399', '251196685', '274770234', '275093645', '275730319', '275810317', '275811779', '321713707', '343532242', '343622738', '348122512', '352663354', '352672743', '352675336', '362407398', '365293518', '368280946', '370216771', '370356507', '370505920', '370556770', '376325860', '383479271', '397965962', '402947359', '402981397', '414389069', '512485535', '528808010', '532543669', '534422890', '540273531', '89996107', '907007009', '908155356', '916432535', '917180584', '932873475', '932875284', '932878823', '93758975', '94323465', '95433011', '95656065', '95682926', '95905943', '96518515', '96723038', '97392093', '983401917', '98374273', '991566659', '99556773', '99586170', '99594408', '99613567', '99616039', '99635127', '99691411', '99827393', '99829135', '99939238', '99945042', '99985739')
  -- EXCLUDE DUPLICATES ALREADY IN THE VOTERS TABLE
  AND dwid NOT IN ('275794648', '408941295','100742137','100389408');

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
    'CA45'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND state='CA'
  AND congressional_district='45'
  -- EXCLUDE DUPLICATES ALREADY IN A VOTE FORWARD EXPERIMENT
  AND dwid NOT IN ('100051727', '100072023', '100072444', '100082373', '100088370', '100133392', '100141052', '100150364', '100158501', '100160549', '100171700', '100199313', '100254424', '100267109', '100318555', '100323959', '100346958', '100347544', '100351898', '100385955', '100392009', '100404152', '100413649', '100418003', '100439382', '100500291', '100541089', '100546619', '100554858', '100614031', '100622278', '100646385', '100690128', '100711786', '100712891', '100719293', '100780946', '100810366', '100853298', '100880264', '100922480', '100938775', '100944100', '100977975', '100997073', '104174451', '104352169', '111879781', '124210963', '125964553', '146163478', '181871711', '182824354', '183184778', '184144173', '184392401', '185596739', '185613770', '196273479', '241264685', '243255723', '244075327', '244842906', '245035277', '246090424', '247635399', '251196685', '274770234', '275093645', '275730319', '275810317', '275811779', '321713707', '343532242', '343622738', '348122512', '352663354', '352672743', '352675336', '362407398', '365293518', '368280946', '370216771', '370356507', '370505920', '370556770', '376325860', '383479271', '397965962', '402947359', '402981397', '414389069', '512485535', '528808010', '532543669', '534422890', '540273531', '89996107', '907007009', '908155356', '916432535', '917180584', '932873475', '932875284', '932878823', '93758975', '94323465', '95433011', '95656065', '95682926', '95905943', '96518515', '96723038', '97392093', '983401917', '98374273', '991566659', '99556773', '99586170', '99594408', '99613567', '99616039', '99635127', '99691411', '99827393', '99829135', '99939238', '99945042', '99985739')
  -- EXCLUDE DUPLICATES ALREADY IN THE VOTERS TABLE
  AND dwid NOT IN ('275794648', '408941295','100742137','100389408');

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
