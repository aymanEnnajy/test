import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Building2, User, ArrowRight, ArrowLeft, Phone, MapPin, Mail, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        // Organization
        organization_name: '',
        organization_email: '',
        organization_phone: '',
        organization_address: '',
        // Admin
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        position: 'CEO',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.organization_name || !formData.organization_email) {
                setError('Please enter company name and email');
                return;
            }
        }
        setError('');
        setStep(2);
    };

    const prevStep = () => {
        setError('');
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const { error: regError } = await register({
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            position: formData.position,
            organization_name: formData.organization_name,
            organization_email: formData.organization_email,
            organization_phone: formData.organization_phone,
            organization_address: formData.organization_address,
            role: 'ADMIN'
        });

        if (regError) {
            setError(regError.message);
            setIsLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">HR Intelligent</h1>
                            <p className="text-xs text-muted-foreground">Business Process Management</p>
                        </div>
                    </div>
                </div>

                <Card className="border-border/50 shadow-xl">
                    <CardContent className="p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold">Create an account</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {step === 1 ? 'Tell us about your company' : 'Set up your admin profile'}
                            </p>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {step === 1 ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_name">Company Name*</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="organization_name"
                                                placeholder="e.g. Acme Corp"
                                                value={formData.organization_name}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_email">Company Email*</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="organization_email"
                                                type="email"
                                                placeholder="contact@acme.com"
                                                value={formData.organization_email}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_phone">Company Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="organization_phone"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.organization_phone}
                                                onChange={handleInputChange}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_address">Company Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="organization_address"
                                                placeholder="123 Business St, City"
                                                value={formData.organization_address}
                                                onChange={handleInputChange}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" onClick={nextStep} className="w-full h-11 group">
                                        Next Step
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name*</Label>
                                            <Input
                                                id="first_name"
                                                placeholder="John"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name*</Label>
                                            <Input
                                                id="last_name"
                                                placeholder="Doe"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email*</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@acme.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    placeholder="+1..."
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Position</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="position"
                                                    placeholder="Manager"
                                                    value={formData.position}
                                                    onChange={handleInputChange}
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password*</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Min. 6 characters"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password">Confirm Password*</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            placeholder="Repeat your password"
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={prevStep} className="h-11">
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 h-11"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
