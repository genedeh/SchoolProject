from django.urls import path
from . import views 


urlpatterns = [
    path("login/",views.LoginView.as_view(), name="login"),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/', views.CreateAndSearchUserView.as_view(), name='users'),
    path('users/<int:pk>/', views.UpdateAndDeleteUserView.as_view(), name='user'),
    path('quick_users_view/', views.QuickUserViewList.as_view(), name='user'),
]
