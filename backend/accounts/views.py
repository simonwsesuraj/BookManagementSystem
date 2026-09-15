from django.shortcuts import render
from . models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response   
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
@api_view(["post"])
def login_view(request):

    phone_number = request.data.get("phone_number")
    password = request.data.get("password")

    if not phone_number or not password:
        return Response({
            "message":"Phone number and password is required."
        },status=status.HTTP_400_BAD_REQUEST)


    user = authenticate(username=phone_number,password=password)

    if not user:
        return Response({
            "message":"Invalid user name or password.",
        },status=status.HTTP_401_UNAUTHORIZED)


    refresh = RefreshToken.for_user(user)

    return Response({
        "message":"Login successful",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "phone_number": user.phone_number,
        }
    })


@api_view(["POST"])
def logout_view(request):

    refresh_token = request.data.get("refresh_token")

    print("Received refresh token:", refresh_token)

    if not refresh_token:
        return Response(
            {
                "message": "Refresh token is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        token = RefreshToken(refresh_token)

        token.blacklist()

        return Response(
            {
                "message": "Logout Successful."
            },
            status=status.HTTP_200_OK
        )

    except TokenError as error:

        print("Token Error:", error)

        return Response(
            {
                "message": "Invalid or expired refresh token."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        "user": {
            "id": request.user.id,
            "phone_number": request.user.phone_number,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        }
    })