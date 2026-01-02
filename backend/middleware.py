from __future__ import annotations


class NormalizeDuplicateOriginMiddleware:
    """Normalize duplicate Origin headers into a single value.

    In some proxy setups, the request may arrive with the same Origin header
    duplicated. WSGI servers commonly join duplicate headers with commas,
    which breaks Django's CSRF origin verification.

    We only normalize when all provided origins are identical.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.META.get("HTTP_ORIGIN")
        if origin and "," in origin:
            parts = [p.strip() for p in origin.split(",") if p.strip()]
            if parts:
                unique = set(parts)
                if len(unique) == 1:
                    request.META["HTTP_ORIGIN"] = parts[0]
        return self.get_response(request)
