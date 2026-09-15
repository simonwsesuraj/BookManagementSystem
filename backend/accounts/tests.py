from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from accounts.models import User


class LogoutAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone_number="1234567890",
            password="strongpass123",
        )

    def test_logout_accepts_refresh_token_field(self):
        refresh = self.user.refresh_token if hasattr(self.user, "refresh_token") else None
        self.assertIsNone(refresh)

        token = self.client.post(
            reverse("login_view"),
            {"phone_number": "1234567890", "password": "strongpass123"},
            format="json",
        )
        refresh_token = token.data["refresh"]

        response = self.client.post(
            reverse("logout_view"),
            {"refresh_token": refresh_token},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("Logout Successful", response.data["message"])
