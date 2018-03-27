update voters set plea_letter_sent_timestamp=null where plea_letter_sent_timestamp is not null;
update voters set adoption_timestamp=null where adoption_timestamp is not null;
update voters set plea_letter_url='' where plea_letter_url is not null;
update voters set adopter_user_id=null where adopter_user_id is not null;
