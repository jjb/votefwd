// Utility functions
// These should be be simple helper functions for fetching or verifying information from a data model
// --------------------------------------------------
// User Utilities

export function isAdmin(user) {
	if (user.is_admin) {
		return true;
	}
	return false;
}

export function isUserQualified(user) {
	if (user.qual_state === "qualified" || user.qual_state === "super_qualified") {
		return true;
	}
	return false;
}
