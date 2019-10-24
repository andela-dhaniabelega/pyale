from django.test import TestCase
from django_dynamic_fixture import G
from core.models import PropertyRunningCosts, Property


class PropertyTest(TestCase):
    def test_net_revenue_computed_correctly(self):
        sample_property = G(Property)
        G(PropertyRunningCosts, n=2)

        sample_property.rental_revenue = 2000
        sample_property.save()
        self.assertIsNotNone(sample_property.net_revenue)
        self.assertIsNotNone(sample_property.year)

