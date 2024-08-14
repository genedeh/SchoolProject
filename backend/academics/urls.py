from django.urls import path
from . import views 


urlpatterns = [
    path("classrooms/<int:pk>/",views.ClassRoomRetrieveView.as_view(), name="classrooms-retireve"),
    path("classrooms/", views.ClassRoomListView.as_view(), name="classrooms"),
    path("offering-subjects/", views.OfferingSubjectsListView.as_view(), name="offering-subjects"),
    path("subjects/", views.SubjectsListView.as_view(), name='subjects'),
    path("subjects/<int:pk>/", views.SubjectsRetrieveView.as_view(), name='subjects')
]
