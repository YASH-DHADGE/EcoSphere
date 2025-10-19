from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'entries', views.CarbonEntryViewSet, basename='carbon-entry')
router.register(r'goals', views.CarbonGoalViewSet, basename='carbon-goal')

urlpatterns = [
    path('', include(router.urls)),
    path('summary/', views.CarbonSummaryView.as_view({'get': 'list'}), name='carbon-summary'),
    path('comparison/', views.CarbonComparisonView.as_view({'get': 'list'}), name='carbon-comparison'),
    path('export/', views.CarbonExportView.as_view({'get': 'list'}), name='carbon-export'),
]
